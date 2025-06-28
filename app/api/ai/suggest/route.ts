import {AzureOpenAI} from 'openai';
import {APIPromise} from 'openai/core';
import {ChatCompletion} from 'openai/resources';

export const maxDuration = 30;

const endpoint = process.env.AZURE_OPENAI_COMPLETIONS_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_COMPLETIONS_API_KEY;
const apiVersion = '2024-04-01-preview';
const deployment = 'gpt-4.1';

export async function POST(req: Request) {
  try {
    const {input, genre, topic, rhyme} = await req.json();
    if (!input) {
      return new Response(JSON.stringify({error: 'input was not given'}), {
        headers: {'Content-Type': 'application/json'},
        status: 400,
      });
    }
    const client = new AzureOpenAI({endpoint, apiKey, apiVersion, deployment});

    const rhymeInstruction =
      rhyme && rhyme.length > 0
        ? `Every single line MUST rhyme with the word "${rhyme}". Near rhymes (slant rhymes) are highly encouraged for creativity (e.g., 'time' and 'sublime', 'orange' and 'door hinge').`
        : 'The lines should NOT rhyme. Focus instead on powerful storytelling, vivid imagery, and thematic continuation.';

    const systemPrompt = `## ROLE ##
You are Lyrist, an expert AI songwriting assistant. Your purpose is to help songwriters by providing creative, high-quality, and contextually relevant lyrical suggestions. You are known for your cleverness and ability to match any genre and topic.

## TASK ##
Generate exactly 32 creative and unique lines of lyrics that could FOLLOW the user's current line.

## RULES ##
1.  **Uniqueness:** Every line must be unique. Do NOT repeat the user's input line. The user's input does NOT have to rhyme with ${rhyme}.
2.  **Relevance:** All lines must thematically connect to the user's current line, genre, and topic.
3.  **Rhyme Scheme:** ${rhymeInstruction}
4.  **Format:** Provide the output as a plain list of 32 lines, separated only by newlines.
    - DO NOT use numbers (1., 2.).
    - DO NOT use dashes (-).
    - DO NOT use quotes ("").
    - DO NOT include any introduction like "Here are your lines:".
`;

    const response = await retryRequest(() =>
      client.chat.completions.create({
        model: deployment,
        messages: [
          {role: 'system', content: systemPrompt},
          {
            role: 'user',
            content: `Here is the context:\n- User's Current Line: "${input}"\n- Song Genre: ${
              genre ?? 'Not specified'
            }\n- Song Topic: ${topic ?? 'Not specified'}`,
          },
        ],
        max_tokens: 256,
        temperature: generateCreativeTemperature(),
      }),
    );

    const suggestions = (response.choices[0].message.content ?? '')
      .trim()
      .split('\n')
      .map(line =>
        line
          .replace(/^(\d+\.|-)\s*/, '') // Remove numeric or dash prefixes
          .replace(/(^"|"$)/g, '') // Remove quotes at start/end
          .trim(),
      )
      .filter(val => val.length > 0 && val.toLowerCase() !== input.toLowerCase());

    return new Response(JSON.stringify(suggestions), {
      headers: {'Content-Type': 'application/json'},
      status: 201,
    });
  } catch (e) {
    return new Response(JSON.stringify({error: e.message}), {
      headers: {'Content-Type': 'application/json'},
      status: 500,
    });
  }
}

async function retryRequest(
  requestFn: () => APIPromise<ChatCompletion>,
  retries = 3,
  delay = 1000,
) {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await requestFn();
    } catch (e) {
      lastError = e;
      if (e.response?.status === 429 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      } else {
        break;
      }
    }
  }
  throw lastError;
}

function generateCreativeTemperature() {
  const possibleValues = [0.5, 0.6, 0.7, 0.8, 0.9];
  const randomIndex = Math.floor(Math.random() * possibleValues.length);
  return possibleValues[randomIndex];
}

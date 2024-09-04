import {AzureOpenAI} from 'openai';

export const maxDuration = 30;

const endpoint = process.env.AZURE_OPENAI_COMPLETIONS_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_COMPLETIONS_API_KEY;
const apiVersion = '2024-05-01-preview';
const deployment = 'gpt-35-turbo-instruct-0914';

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
    const prompt = `You are a world-class songwriter. Generate a set of 16 lines I can add to this current line based on ${
      topic ?? 'any topic'
    } in ${
      genre ?? 'any genre of'
    } music for the following text: ${input}. No two lines should be the same nor should be ${input}. ${
      rhyme.length > 0 ? `Every line needs to rhyme with ${rhyme}` : 'Lines do not have to rhyme'
    }. Please format the array without preceding numbers, preceding dashes, or preceding bullet points. Make sure each item separated by "\n".`;

    const response = await client.completions.create({
      model: deployment,
      prompt: prompt,
      max_tokens: 256,
    });
    const suggestions = response.choices[0].text
      .trim()
      .split('\n')
      .map(line =>
        line
          .replace(/^\d+\)\s*/, '') // Remove numeric prefixes like "1)", "2)", etc.
          .replace(/(^"|"$)/g, '') // Remove double quotes
          .replace(/^-/, '') // Remove dashes at the beginning
          .replace(/\.$/, '') // Remove periods at the end
          .trim(),
      )
      .filter(val => val.length > 0);
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

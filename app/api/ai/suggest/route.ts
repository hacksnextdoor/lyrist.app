import {AzureOpenAI} from 'openai';
import {APIPromise} from 'openai/core';
import {Completion} from 'openai/resources';

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
      rhyme.length > 0
        ? `Every line needs to rhyme with ${rhyme} and near rhymes like "orange" and "door hinge" are acceptable.`
        : 'Lines do not have to rhyme'
    }. Please format the array without preceding numbers, preceding dashes, preceding bullet points. Each line should be considered one element in the array. Here is an example format:

Line 1
Line 2
Line 3
...
Line 16`;

    const response = await retryRequest(() =>
      client.completions.create({
        model: deployment,
        prompt: prompt,
        max_tokens: 192,
        best_of: 1,
        temperature: generateTemperature(),
      }),
    );
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

async function retryRequest(requestFn: () => APIPromise<Completion>, retries = 3, delay = 1000) {
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

function generateTemperature() {
  const possibleValues = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
  const randomIndex = Math.floor(Math.random() * possibleValues.length);
  return possibleValues[randomIndex];
}

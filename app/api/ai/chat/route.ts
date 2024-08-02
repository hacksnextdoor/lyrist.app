import {AzureOpenAI} from 'openai';

const endpoint = process.env.AZURE_OPENAI_CHAT_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_CHAT_API_KEY;
const apiVersion = '2024-05-01-preview';
const deployment = 'gpt-4o-2024-05';

export async function POST(req: Request) {
  try {
    const {input} = await req.json();
    if (!input) {
      return new Response(JSON.stringify({error: 'input was not given'}), {
        headers: {'Content-Type': 'application/json'},
        status: 400,
      });
    }
    const client = new AzureOpenAI({endpoint, apiKey, apiVersion, deployment});
    const stream = client.beta.chat.completions.stream({
      messages: [
        {
          role: 'system',
          content:
            'You are professional songwriting assistant. Please only answer questions about songwriting and music. If someone asks where to find the word finder or rhymes let them know the word finder is now part of a suite of features including suggestions, rhymes, and thesaurus which can be found by selecting the sparkle icon in any page.',
        },
        {role: 'user', content: input},
      ],
      model: deployment,
      stream: true,
      max_tokens: 256,
    });
    // inspired by https://upstash.com/blog/sse-streaming-llm-responses
    const customReadable = new ReadableStream({
      start(controller) {
        stream.on('content', content => controller.enqueue(content));
        stream.on('end', () => controller.close());
        stream.on('error', err => controller.error(err));
      },
    });
    return new Response(customReadable, {
      headers: {
        Connection: 'keep-alive',
        'Content-Encoding': 'none',
        'Cache-Control': 'no-cache, no-transform',
        'Content-Type': 'text/event-stream; charset=utf-8',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({error: e.message}), {
      headers: {'Content-Type': 'application/json'},
      status: 500,
    });
  }
}

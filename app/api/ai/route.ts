import {AzureOpenAI} from 'openai';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = '2024-05-01-preview';
const deployment = 'gpt-4o-2024-05';

export async function POST(req: Request) {
  try {
    const {input} = await req.json();
    if (!input) {
      throw new Error('input is not given');
    }
    const client = new AzureOpenAI({endpoint, apiKey, apiVersion, deployment});
    const stream = client.beta.chat.completions.stream({
      messages: [
        {
          role: 'system',
          content:
            'You are professional songwriting assistant. Please only answer questions about songwriting and music. Questions that refer to Word Finder should be answered with information about Lyrist the app itself such as "selecting words in one of your pages activates the word finder via the sparkle button in the dashboard above the keyboard."',
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
    console.error(e);
  }
}

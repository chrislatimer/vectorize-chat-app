import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  let context = null; // Initialize with a default value

  if (messages.length > 0) {
    context = await retrieveData(String(messages[messages.length - 1]));
  } else {
    console.log('No messages available, skipping retrieveData.');
  }

  // Override the last message to include the context
  if (messages.length > 0 && context) {
    messages[messages.length - 1].content = `
      Use only the following context to inform your response:
      Context: ${JSON.stringify(context) || 'No additional context provided.'}

      Original Message: ${messages[messages.length - 1].content}
    `;
  }

  console.log('sending messages to the LLM', messages);

  const result = await streamText({
    model: openai('gpt-4'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}

const retrieveData = async (question: string) => {
  const token = process.env.VECTORIZE_TOKEN;

  const pipelineRetrievalUrl = ''; // Set this to the retrieval endpoint for your pipeline

  if (!token) {
    throw new Error('VECTORIZE_TOKEN is not set in the environment variables. Please add it to your .env file.');
  }

  if (!pipelineRetrievalUrl) {
    throw new Error('pipelineRetrievalUrl is not set. Please define the URL in routes.ts before calling retrieveData.');
  }

  const response = await fetch(pipelineRetrievalUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      question,
      numResults: 5,
      rerank: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

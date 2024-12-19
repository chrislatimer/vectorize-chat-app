import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  let context = null; // Initialize with a default value

  if (messages.length > 0) {
    context = await retrieveData(String(messages[messages.length - 1].content));
  } else {
    console.log('No messages available, skipping retrieveData.');
  }

  // Override the last message to include the context
  if (messages.length > 0 && context) {
    messages[messages.length - 1].content = `
      Based on the current message, decide whether to use the following context or the message history to respond.
      
      Context: ${JSON.stringify(context) || 'No additional context provided.'}

      Original Message: ${messages[messages.length - 1].content}
    `;
  }

  console.log('sending messages to the LLM', messages);

  const result = await streamText({
    model: openai('gpt-4'),
    system: 'You are a helpful assistant. You always generate your responses as correctly structured, valid markdown.',
    messages,
  });

  return result.toDataStreamResponse();
}

const retrieveData = async (question: string) => {
  const token = process.env.VECTORIZE_TOKEN;

  const pipelineRetrievalUrl = process.env.retrievalUrl;

  if (!token) {
    throw new Error('VECTORIZE_TOKEN is not set in the environment variables. Please add it to your .env file.');
  }

  if (!pipelineRetrievalUrl) {
    throw new Error(
      'pipelineRetrievalUrl is not set. Please define the URL in the environment settings (e.g. in the file .env.development) before calling retrieveData.'
    );
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

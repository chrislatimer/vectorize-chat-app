'use client';

import { Message, useChat } from 'ai/react';
import Markdown from 'react-markdown';
import { useState } from 'react';
import remarkGfm from 'remark-gfm';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedMessage(null);
    }
  };

  const MessageDialog = ({ message }: { message: Message }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-zinc-900 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Raw Message Content</h2>
          <button onClick={() => setSelectedMessage(null)} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>
        <pre className="bg-zinc-950 p-4 rounded-md overflow-auto whitespace-pre-wrap">{JSON.stringify(message, null, 2)}</pre>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Messages Container */}
        <div className="mb-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.role === 'user' ? 'User:' : 'Assistant:'}</span>
                  <button onClick={() => setSelectedMessage(message)} className="text-xs text-zinc-500 hover:text-zinc-400">
                    View Raw
                  </button>
                </div>
                <div className="prose prose-invert max-w-none">
                  <div className="[&>table]:w-full [&>table]:border-collapse [&>table]:my-4 [&>table>thead>tr]:border-b [&>table>thead>tr]:border-zinc-700 [&>table>tbody>tr]:border-b [&>table>tbody>tr]:border-zinc-800 [&>table>*>tr>*]:p-2 [&>table>*>tr>*]:text-left [&>table>thead>tr>*]:font-semibold [&>table>tbody>tr>*]:align-top">
                    <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 bg-zinc-900 text-white px-4 py-2 rounded-md border border-zinc-700 focus:outline-none focus:border-zinc-600"
          />
          <button type="submit" className="bg-zinc-800 text-white px-6 py-2 rounded-md hover:bg-zinc-700 transition-colors">
            Send Message
          </button>
        </form>
      </div>

      {/* Show dialog when a message is selected */}
      {selectedMessage && <MessageDialog message={selectedMessage} />}
    </div>
  );
}

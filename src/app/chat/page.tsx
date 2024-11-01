'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Messages Container */}
        <div className="mb-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-2">
              <span className="font-medium">{message.role === 'user' ? 'User:' : 'Assistant:'}</span>
              <span>{message.content}</span>
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
    </div>
  );
}

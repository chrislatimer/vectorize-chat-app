'use client';

import { Message, useChat } from 'ai/react';
import Markdown from 'react-markdown';
import { useState, useRef, useEffect } from 'react';
import remarkGfm from 'remark-gfm';
import { ChevronDown } from 'lucide-react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShouldAutoScroll(true);
  };

  // Handle scroll events
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

    setShouldAutoScroll(isAtBottom);
    setShowScrollButton(!isAtBottom);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  const formatJSON = (obj: Record<string, unknown>) => {
    const stringifyWithHighlight = (key: string, value: unknown) => {
      if (typeof value === 'string') {
        return `"${value}"`;
      }
      return value;
    };

    const jsonString = JSON.stringify(obj, stringifyWithHighlight, 2);

    // Add syntax highlighting classes
    return jsonString
      .split('\n')
      .map((line) => {
        // Highlight keys
        line = line.replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:');
        // Highlight string values
        line = line.replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>');
        // Highlight numbers
        line = line.replace(/: (\d+)/g, ': <span class="text-yellow-400">$1</span>');
        // Highlight booleans
        line = line.replace(/: (true|false)/g, ': <span class="text-purple-400">$1</span>');
        return line;
      })
      .join('\n');
  };

  const MessageDialog = ({ message }: { message: Message }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-gray-900 p-6 rounded-lg max-w-3xl w-full mx-4 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Message Details</h2>
          <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div
          className="bg-gray-950 p-6 rounded-lg font-mono text-sm leading-relaxed overflow-auto"
          dangerouslySetInnerHTML={{ __html: formatJSON(message as unknown as Record<string, unknown>) }}
        />
      </div>
    </div>
  );

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedMessage(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Messages Container */}
      <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 relative scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'bg-gray-800' : 'bg-gray-900'} p-6 rounded-lg`}>
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${message.role === 'user' ? 'bg-gray-600' : 'bg-blue-600'}`}
              >
                {message.role === 'user' ? '👤' : '🤖'}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="prose prose-invert max-w-none">
                  <div
                    className="[&>table]:w-full [&>table]:border-collapse [&>table]:my-4 
                               [&>table>thead>tr]:border-b [&>table>thead>tr]:border-gray-700 
                               [&>table>tbody>tr]:border-b [&>table>tbody>tr]:border-gray-800 
                               [&>table>*>tr>*]:p-2 [&>table>*>tr>*]:text-left 
                               [&>table>thead>tr>*]:font-semibold [&>table>tbody>tr>*]:align-top"
                  >
                    <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                  </div>
                </div>
                <button onClick={() => setSelectedMessage(message)} className="mt-2 text-xs text-gray-500 hover:text-gray-400">
                  View Details
                </button>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-8 bg-gray-700 text-white p-2 rounded-full shadow-lg 
                   hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <ChevronDown className="w-5 h-5" />
          <span className="pr-2">Scroll to bottom</span>
        </button>
      )}

      {/* Input Container - Fixed at bottom */}
      <div className="border-t border-gray-800 bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Message ChatGPT..."
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 
                       focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Dialog Modal */}
      {selectedMessage && <MessageDialog message={selectedMessage} />}
    </div>
  );
}

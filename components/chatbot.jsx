"use client";

import { useState } from 'react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi! Ask me anything about your finances.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const updatedMessages = [...messages, { role: 'user', content: input }]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        body: JSON.stringify({ messages: updatedMessages }),
      })
      const data = await res.json()
      setMessages([...updatedMessages, { role: 'bot', content: data.reply }])
    } catch (err) {
      setMessages([...updatedMessages, { role: 'bot', content: 'Error: Could not reach chatbot.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        //className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl z-50 hover:bg-blue-700 text-lg"
     className="fixed bottom-19 right-19 bg-blue-600 text-white p-6 rounded-full shadow-xl z-50 hover:bg-blue-700 text-2xl w-16 h-16 flex items-center justify-center"

     >
        🤖
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
       className="fixed bottom-24 right-6 w-[400px] h-[550px] bg-white border border-gray-300 rounded-2xl shadow-2xl flex flex-col z-50"
       >
          {/* Header */}
          <div className="p-4 border-b bg-blue-600 text-white font-semibold text-lg flex justify-between items-center rounded-t-2xl">
            Finance Assistant
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300 text-xl">×</button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-base">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-${msg.role === 'user' ? 'right' : 'left'}`}
              >
                <div className={`inline-block px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-400 text-sm">Bot is typing...</div>}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border p-2 rounded-lg text-base"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-base"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}


import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { ChatMessage, MessageRole } from '../types';
import { createChat, generateImage } from '../services/geminiService';
import Header from './Header';
import ChatMessageComponent from './ChatMessage';
import MessageInput from './MessageInput';
import CatIcon from './icons/CatIcon';
import { useSoundEffects } from '../hooks/useSound';

const initialMessage: ChatMessage = {
  role: MessageRole.MODEL,
  text: "Meow. What do you want? Ask me to draw something if you'd like.",
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const savedMessages = localStorage.getItem('chatHistory');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
    }
    return [initialMessage];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { playSendSound, playReceiveSound } = useSoundEffects();

  useEffect(() => {
    chatRef.current = createChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  }, [messages]);

  const handleNewChat = () => {
    setIsLoading(false);
    setLoadingText('');
    chatRef.current = createChat();
    setMessages([initialMessage]);
    localStorage.removeItem('chatHistory');
  };

  const handleSendMessage = async (message: string) => {
    if (!chatRef.current) return;
    
    playSendSound();
    setIsLoading(true);
    setLoadingText('');

    const userMessage: ChatMessage = { role: MessageRole.USER, text: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await chatRef.current.sendMessage({ message });
      const response = result;

      // FIX: The property for a tool call on a Part object is 'functionCall', not 'toolCall'.
      const toolCalls = response.candidates?.[0]?.content?.parts
        .filter(part => !!part.functionCall)
        .map(part => part.functionCall);
      
      if (toolCalls && toolCalls.length > 0) {
        const imageToolCall = toolCalls.find(call => call.name === 'generate_image');
        const imagePrompt = imageToolCall?.args?.prompt;

        if (imageToolCall && typeof imagePrompt === 'string') {
          setLoadingText(`Mittens is drawing a ${imagePrompt}...`);
          try {
            const imageData = await generateImage(imagePrompt);
            const imageUrl = `data:image/png;base64,${imageData}`;
            const imageMessage: ChatMessage = { role: MessageRole.MODEL, text: `Here.`, imageUrl };
            setMessages(prev => [...prev, imageMessage]);
            playReceiveSound();
          } catch (imageError) {
            console.error("Error generating image:", imageError);
            const errorMessage: ChatMessage = { role: MessageRole.MODEL, text: "*tries to draw but just knocks the crayons off the table*" };
            setMessages(prev => [...prev, errorMessage]);
            playReceiveSound();
          }
        } else {
          throw new Error("Invalid tool call received");
        }
      } else {
        const modelResponse: ChatMessage = { role: MessageRole.MODEL, text: response.text };
        setMessages(prev => [...prev, modelResponse]);
        playReceiveSound();
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = { role: MessageRole.MODEL, text: "Mrrow... I don't feel like talking right now." };
      setMessages(prev => [...prev, errorMessage]);
      playReceiveSound();
    } finally {
      setIsLoading(false);
      setLoadingText('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header onNewChat={handleNewChat} />
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessageComponent key={index} message={msg} />
        ))}
        {isLoading && (
           <div className="flex items-start gap-3 my-4 justify-start animate-slide-in-fade">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
               <CatIcon className="w-5 h-5 text-cyan-400" animation="pulse" />
             </div>
             <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-slate-700 text-slate-200 rounded-tl-none">
                {loadingText ? (
                  <p className="text-sm italic">{loadingText}</p>
                ) : (
                  <div className="flex items-center space-x-1 h-5">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  </div>
                )}
             </div>
           </div>
        )}
      </div>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
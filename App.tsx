import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/10 bg-slate-800/50 backdrop-blur-sm">
        <ChatInterface />
      </div>
       <footer className="text-center p-4 text-xs text-slate-500">
          Powered by Gemini API. Created for you by a world-class React engineer.
      </footer>
    </div>
  );
}

export default App;

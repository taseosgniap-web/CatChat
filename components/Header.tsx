import React from 'react';
import CatIcon from './icons/CatIcon';

interface HeaderProps {
  onNewChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-700 shadow-md flex-shrink-0">
      <div className="flex items-center">
        <CatIcon className="w-8 h-8 text-cyan-400 mr-3" />
        <h1 className="text-xl font-bold text-slate-100">Cat Chat</h1>
      </div>
      <button
        onClick={onNewChat}
        className="text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label="Start a new chat"
      >
        New Chat
      </button>
    </div>
  );
};

export default Header;
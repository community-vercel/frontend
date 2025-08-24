import {User, Menu } from 'lucide-react';

export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100/30 px-4 sm:px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <button className="sm:hidden p-2 hover:bg-blue-50 rounded-full transition-colors" onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full hidden sm:block"></div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            Management Dashboard
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-blue-50 transition-colors">
            <User className="w-5 h-5 text-slate-600 hover:text-blue-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
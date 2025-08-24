'use client'; // Optional: Use if SSR cannot be fixed
import { useEffect } from 'react';
import { HomeIcon, DocumentCheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { Rocket, X } from 'lucide-react';

export default function Sidebar({ isOpen = false, setIsOpen = () => {} }) {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && !e.target.closest('.sidebar')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen, setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`sidebar fixed sm:static inset-y-0 left-0 w-64 bg-white/95 shadow-xl border-r border-blue-100/30 backdrop-blur-lg transform transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-blue-100/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-indigo-500 bg-clip-text text-transparent">
                  EOS
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-tight">Issues & To-Dos</p>
              </div>
            </div>
            <button
              className="sm:hidden p-2 hover:bg-blue-50 rounded-full transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {[
              { href: '/', label: 'Dashboard', Icon: HomeIcon },
              { href: '/issues', label: 'Issues Board', Icon: ClipboardDocumentListIcon },
              { href: '/todos', label: 'To-Dos', Icon: DocumentCheckIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-blue-100/50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-500 group-hover:text-blue-600" />
                <span className="font-medium text-sm">{label}</span>
              </a>
            ))}
          </nav>
          <div className="p-4 border-t border-blue-100/50">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/30 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">C20 EOS</h2>
                  <p className="text-xs text-slate-500">Streamline your operations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
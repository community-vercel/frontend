'use client';
import './globals.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useState } from 'react';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>EOS Issue Tracking & Task Management</title>
 <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter antialiased bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-200 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

          <div className="flex-1 flex flex-col">
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>

      </body>
    </html>
  );
}
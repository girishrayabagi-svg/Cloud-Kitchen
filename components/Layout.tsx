
import React from 'react';
import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-2">CloudKitchen Pro</h2>
          <p className="text-gray-400 text-sm">Deliciously fresh food delivered within minutes.</p>
          <p className="mt-4 text-xs text-gray-500">© 2024 CloudKitchen Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* Fix: Wrapped CSS content in a template literal to prevent it from being parsed as JavaScript/TypeScript code */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      @keyframes slide-left {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      @keyframes scale-up {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-slide-left { animation: slide-left 0.3s ease-out; }
      .animate-scale-up { animation: scale-up 0.3s ease-out; }
      .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out;
      }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
    <App />
  </React.StrictMode>
);

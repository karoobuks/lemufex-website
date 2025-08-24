// TypingDots.jsx
import { useState, useEffect } from 'react';

export default function TypingDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-white font-semibold">Loading{dots}</span>;
}

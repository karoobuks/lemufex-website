
import { useState, useEffect } from 'react';

export default function UpdatingProfile() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-white font-semibold">Updating Profile{dots}</span>;
}
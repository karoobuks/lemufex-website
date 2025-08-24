'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPassword({ userId }) {
//   const { token } = params;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();

    // console.log("token:",token)
    if (password !== confirm) {
      return setStatus('Passwords do not match');
    }

    const res = await fetch('/api/account/reset-password', {
      method: 'POST',
      body: JSON.stringify({ userId, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('Password reset successful. Redirecting...');
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setStatus(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4 sm:px-6 lg:px-8 ">
      <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
      <form onSubmit={handleReset} className="space-y-4 ">
        <input
          type="password"
          placeholder="New password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full border p-2 rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-[#FE9900] text-white p-2 rounded hover:bg-amber-400">
          Reset Password
        </button>
        {status && <p className="text-sm text-center text-red-600">{status}</p>}
      </form>
    </div>
  );
}

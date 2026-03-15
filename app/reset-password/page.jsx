'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

function ResetPasswordFormComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Invalid or missing reset token.');
            toast.error('Invalid or missing reset token.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            toast.error('Passwords do not match.');
            return;
        }

        if (!token) {
            setError('No reset token found.');
            toast.error('No reset token found.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/account/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong.');
            }

            setSuccess(data.message);
            toast.success(data.message);
            // Redirect to login page after a few seconds
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='bg-gray-50'>
            <div className='container m-auto max-w-2xl py-24'>
                <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
                    <h2 className='text-3xl text-center font-semibold mb-6'>
                        Reset Your Password
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label
                                htmlFor='password'
                                className='block text-gray-700 font-bold mb-2'
                            >
                                New Password
                            </label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                className='border rounded w-full py-2 px-3'
                                placeholder='Enter new password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading || !!success}
                            />
                        </div>

                        <div className='mb-4'>
                            <label
                                htmlFor='confirmPassword'
                                className='block text-gray-700 font-bold mb-2'
                            >
                                Confirm New Password
                            </label>
                            <input
                                type='password'
                                id='confirmPassword'
                                name='confirmPassword'
                                className='border rounded w-full py-2 px-3'
                                placeholder='Confirm new password'
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading || !!success}
                            />
                        </div>

                        <div>
                            <button
                                className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                                type='submit'
                                disabled={loading || !token || !!success}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>

                        {success && (
                            <p className='text-green-500 text-center mt-4'>
                                {success}. Redirecting to login...
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordFormComponent />
        </Suspense>
    );
};

export default ResetPasswordPage;
// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// function ResetPasswordFormComponent() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const [token, setToken] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     useEffect(() => {
//         const tokenFromUrl = searchParams.get('token');
//         if (tokenFromUrl) {
//             setToken(tokenFromUrl);
//         } else {
//             setError('Invalid or missing reset token.');
//             toast.error('Invalid or missing reset token.');
//         }
//     }, [searchParams]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         if (password !== confirmPassword) {
//             setError('Passwords do not match.');
//             toast.error('Passwords do not match.');
//             return;
//         }

//         if (!token) {
//             setError('No reset token found.');
//             toast.error('No reset token found.');
//             return;
//         }

//         setLoading(true);

//         try {
//             const res = await fetch('/api/account/reset-password', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ token, password }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.message || 'Something went wrong.');
//             }

//             setSuccess(data.message);
//             toast.success(data.message);
//             // Redirect to login page after a few seconds
//             setTimeout(() => {
//                 router.push('/login');
//             }, 3000);
//         } catch (err) {
//             setError(err.message);
//             toast.error(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <section className='bg-gray-50'>
//             <div className='container m-auto max-w-2xl py-24'>
//                 <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
//                     <h2 className='text-3xl text-center font-semibold mb-6 text-blue-600'>
//                         Reset Your Password
//                     </h2>
//                     <form onSubmit={handleSubmit}>
//                         <div className='mb-4'>
//                             <label
//                                 htmlFor='password'
//                                 className='block text-gray-700 font-bold mb-2'
//                             >
//                                 New Password
//                             </label>
//                             <input
//                                 type='password'
//                                 id='password'
//                                 name='password'
//                                 className='border rounded w-full py-2 px-3'
//                                 placeholder='Enter new password'
//                                 required
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 disabled={loading || !!success}
//                             />
//                         </div>

//                         <div className='mb-4'>
//                             <label
//                                 htmlFor='confirmPassword'
//                                 className='block text-gray-700 font-bold mb-2'
//                             >
//                                 Confirm New Password
//                             </label>
//                             <input
//                                 type='password'
//                                 id='confirmPassword'
//                                 name='confirmPassword'
//                                 className='border rounded w-full py-2 px-3'
//                                 placeholder='Confirm new password'
//                                 required
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 disabled={loading || !!success}
//                             />
//                         </div>

//                         <div>
//                             <button
//                                 className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
//                                 type='submit'
//                                 disabled={loading || !token || !!success}
//                             >
//                                 {loading ? 'Resetting...' : 'Reset Password'}
//                             </button>
//                         </div>

//                         {error && (
//                             <p className='text-red-500 text-center mt-4'>
//                                 {error}
//                             </p>
//                         )}

//                         {success && (
//                             <p className='text-green-500 text-center mt-4'>
//                                 {success}. Redirecting to login...
//                             </p>
//                         )}
//                     </form>
//                 </div>
//             </div>
//         </section>
//     );
// }

// const ResetPasswordPage = () => {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <ResetPasswordFormComponent />
//         </Suspense>
//     );
// };

// export default ResetPasswordPage;


// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// function ResetPasswordFormComponent() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const [token, setToken] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     useEffect(() => {
//         const tokenFromUrl = searchParams.get('token');
//         if (tokenFromUrl) {
//             setToken(tokenFromUrl);
//         } else {
//             setError('Invalid or missing reset token.');
//             toast.error('Invalid or missing reset token.');
//         }
//     }, [searchParams]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         if (password !== confirmPassword) {
//             setError('Passwords do not match.');
//             toast.error('Passwords do not match.');
//             return;
//         }

//         if (!token) {
//             setError('No reset token found.');
//             toast.error('No reset token found.');
//             return;
//         }

//         setLoading(true);

//         try {
//             const res = await fetch('/api/account/reset-password', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ token, password }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.message || 'Something went wrong.');
//             }

//             setSuccess(data.message);
//             toast.success(data.message);

//             setTimeout(() => {
//                 router.push('/login');
//             }, 3000);

//         } catch (err) {
//             setError(err.message);
//             toast.error(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 mt-10">
//             <h2 className="text-2xl font-bold mb-4 text-[#FE9900]">
//                 Reset Your Password
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">

//                 <input
//                     type="password"
//                     className="w-full border p-2 rounded"
//                     placeholder="Enter new password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     disabled={loading || !!success}
//                 />

//                 <input
//                     type="password"
//                     className="w-full border p-2 rounded"
//                     placeholder="Confirm new password"
//                     required
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     disabled={loading || !!success}
//                 />

//                 <button
//                     className="w-full bg-[#FE9900] text-white p-2 rounded hover:bg-amber-400"
//                     type="submit"
//                     disabled={loading || !token || !!success}
//                 >
//                     {loading ? 'Resetting...' : 'Reset Password'}
//                 </button>

//                 {error && (
//                     <p className="text-red-600">{error}</p>
//                 )}

//                 {success && (
//                     <p className="text-green-600">
//                         {success}. Redirecting to login...
//                     </p>
//                 )}

//             </form>
//         </div>
//     );
// }

// const ResetPasswordPage = () => {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <ResetPasswordFormComponent />
//         </Suspense>
//     );
// };

// export default ResetPasswordPage;


// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// function ResetPasswordFormComponent() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const [token, setToken] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     useEffect(() => {
//         const tokenFromUrl = searchParams.get('token');
//         if (tokenFromUrl) {
//             setToken(tokenFromUrl);
//         } else {
//             setError('Invalid or missing reset token.');
//             toast.error('Invalid or missing reset token.');
//         }
//     }, [searchParams]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         if (password !== confirmPassword) {
//             setError('Passwords do not match.');
//             toast.error('Passwords do not match.');
//             return;
//         }

//         if (!token) {
//             setError('No reset token found.');
//             toast.error('No reset token found.');
//             return;
//         }

//         setLoading(true);

//         try {
//             const res = await fetch('/api/account/reset-password', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ token, password }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.message || 'Something went wrong.');
//             }

//             setSuccess(data.message);
//             toast.success(data.message);

//             setTimeout(() => {
//                 router.push('/login');
//             }, 3000);

//         } catch (err) {
//             setError(err.message);
//             toast.error(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

//             <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">

//                 <h2 className="text-3xl font-bold text-center mb-6 text-[#FE9900]">
//                     Reset Your Password
//                 </h2>

//                 <form onSubmit={handleSubmit} className="space-y-4">

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             New Password
//                         </label>
//                         <input
//                             type="password"
//                             className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
//                             placeholder="Enter new password"
//                             required
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             disabled={loading || !!success}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Confirm New Password
//                         </label>
//                         <input
//                             type="password"
//                             className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
//                             placeholder="Confirm new password"
//                             required
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             disabled={loading || !!success}
//                         />
//                     </div>

//                     <button
//                         className="w-full bg-[#FE9900] hover:bg-amber-400 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-60"
//                         type="submit"
//                         disabled={loading || !token || !!success}
//                     >
//                         {loading ? 'Resetting...' : 'Reset Password'}
//                     </button>

//                     {error && (
//                         <p className="text-red-600 text-sm text-center">
//                             {error}
//                         </p>
//                     )}

//                     {success && (
//                         <p className="text-green-600 text-sm text-center">
//                             {success}. Redirecting to login...
//                         </p>
//                     )}

//                 </form>

//             </div>

//         </section>
//     );
// }

// const ResetPasswordPage = () => {
//     return (
//         <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
//             <ResetPasswordFormComponent />
//         </Suspense>
//     );
// };

// export default ResetPasswordPage;



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

    const [strength, setStrength] = useState(0);
    const [strengthLabel, setStrengthLabel] = useState('');

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Invalid or missing reset token.');
            toast.error('Invalid or missing reset token.');
        }
    }, [searchParams]);

    // Password strength checker
    useEffect(() => {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        setStrength(score);

        if (score <= 1) setStrengthLabel('Weak');
        else if (score === 2) setStrengthLabel('Fair');
        else if (score === 3) setStrengthLabel('Good');
        else if (score === 4) setStrengthLabel('Strong');
    }, [password]);

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong.');
            }

            setSuccess(data.message);
            toast.success(data.message);

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
        <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">

                <h2 className="text-3xl font-bold text-center mb-6 text-[#FE9900]">
                    Reset Your Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>

                        <input
                            type="password"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                            placeholder="Enter new password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || !!success}
                        />

                        {/* Password Strength */}
                        {password && (
                            <div className="mt-2">

                                <div className="w-full h-2 bg-gray-200 rounded">
                                    <div
                                        className="h-2 rounded transition-all"
                                        style={{
                                            width: `${strength * 25}%`,
                                            backgroundColor:
                                                strength <= 1
                                                    ? '#ef4444'
                                                    : strength === 2
                                                    ? '#f59e0b'
                                                    : strength === 3
                                                    ? '#10b981'
                                                    : '#22c55e',
                                        }}
                                    />
                                </div>

                                <p className="text-xs mt-1 text-gray-600">
                                    Strength: {strengthLabel}
                                </p>

                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                            placeholder="Confirm new password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading || !!success}
                        />
                    </div>

                    {/* Button */}
                    <button
                        className="w-full bg-[#FE9900] hover:bg-amber-400 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-60"
                        type="submit"
                        disabled={loading || !token || !!success}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    {/* Error */}
                    {error && (
                        <p className="text-red-600 text-sm text-center">
                            {error}
                        </p>
                    )}

                    {/* Success */}
                    {success && (
                        <p className="text-green-600 text-sm text-center">
                            {success}. Redirecting to login...
                        </p>
                    )}

                </form>

            </div>

        </section>
    );
}

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
            <ResetPasswordFormComponent />
        </Suspense>
    );
};

export default ResetPasswordPage;
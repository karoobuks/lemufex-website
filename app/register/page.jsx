'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { FcGoogle } from 'react-icons/fc'
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"
import TypingDots from "@/components/loaders/TypingDots"
import Image from "next/image"
import Logo from "@/assets/images/lemufexbr.png"
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
  FiArrowRight
} from "react-icons/fi"

const RegisterPage = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
    })

    const [loading, setLoading] = useState(false)

    // Redirect if already logged in
    useEffect(() => {
        if (status === "authenticated") {
            router.push('/')
        }
    }, [status, router])

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
        // Clear error when user starts typing
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            if (res.ok) {
                toast.success('Registration successful! Please sign in.')
                router.push('/login')
            } else {
                setError(data.error || 'Registration failed')
                toast.error(data.error || 'Registration failed')
            }
        } catch (error) {
            console.error('Registration Failed:', error)
            setError('Registration failed, something went wrong')
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        try {
            await signIn('google', { callbackUrl: '/' })
        } catch (error) {
            toast.error("Google sign-up failed")
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <TypingDots />
            </div>
        )
    }

    if (status === "authenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-green-500 text-6xl mb-4">✓</div>
                    <p className="text-gray-600">Already logged in. Redirecting...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#002D62] to-[#1F2937] px-8 py-8 text-center">
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 p-3 shadow-lg">
                        <Image 
                            src={Logo}
                            alt="Lemufex Logo" 
                            width={56}
                            height={56}
                            className="rounded-lg"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Join Lemufex
                    </h1>
                    <p className="text-gray-300 text-sm">
                        Create your account with Lemufex Engineering Group
                    </p>
                </div>

                <div className="px-8 py-8 space-y-6">
                    {/* Google Button */}
                    <button
                        onClick={handleGoogleSignup}
                        className="w-full py-3 flex items-center justify-center gap-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <FcGoogle size={24} />
                        <span className="text-gray-700 font-medium">Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">Or register with email</span>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FiUser size={16} />
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    placeholder="First name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                                    onChange={handleChange}
                                    value={formData.firstName}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FiUser size={16} />
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    placeholder="Last name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                                    onChange={handleChange}
                                    value={formData.lastName}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FiMail size={16} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                                onChange={handleChange}
                                value={formData.email}
                                required
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FiPhone size={16} />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                                onChange={handleChange}
                                value={formData.phone}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FiLock size={16} />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Create a strong password"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                                    onChange={handleChange}
                                    value={formData.password}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#FE9900] hover:bg-[#E5890A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <TypingDots />
                            ) : (
                                <>
                                    Create Account
                                    <FiArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign In Prompt */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => router.push('/login')}
                                className="text-[#FE9900] hover:text-[#E5890A] font-semibold transition-colors hover:underline"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our{' '}
                        <button className="text-[#FE9900] hover:underline">Terms of Service</button>
                        {' '}and{' '}
                        <button className="text-[#FE9900] hover:underline">Privacy Policy</button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
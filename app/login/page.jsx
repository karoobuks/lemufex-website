'use client'
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import TypingDots from "@/components/loaders/TypingDots"
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowRight
} from "react-icons/fi"
import Image from "next/image"
import Logo from "@/assets/images/lemufexbr.png"

const LoginPage = () => {
    const { data: session, status } = useSession()
    const [error, setError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [loading, setLoading] = useState(false)

    // Redirect if already logged in
    useEffect(() => {
        if (status === "authenticated") {
            router.push(callbackUrl)
        }
    }, [status, router, callbackUrl])

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
            const res = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
                callbackUrl,
            })

            if (res.error) {
                if (res.error === "CredentialsSignin") {
                    setError("Invalid email or password")
                    toast.error("Invalid email or password")
                } else {
                    setError(res.error)
                    toast.error(res.error)
                }
            } else if (res.ok) {
                toast.success('Login successful! Welcome back.')
                router.refresh()
                if (res.url) {
                    router.push(res.url)
                } else {
                    router.push(callbackUrl)
                }
            }
        } catch (error) {
            setError(error.message)
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await signIn('google', { callbackUrl })
        } catch (error) {
            toast.error("Google sign-in failed")
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
                        Welcome Back
                    </h1>
                    <p className="text-gray-300 text-sm">
                        Sign in to Lemufex Engineering Group
                    </p>
                </div>

                <div className="px-8 py-8 space-y-6">
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                    placeholder="Enter your password"
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

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-[#FE9900] border-gray-300 rounded focus:ring-[#FE9900] focus:ring-2"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => router.push('/forgot-password')}
                                className="text-sm text-[#FE9900] hover:text-[#E5890A] font-medium transition-colors"
                            >
                                Forgot password?
                            </button>
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
                                    Sign In
                                    <FiArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-3 flex items-center justify-center gap-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <FcGoogle size={24} />
                        <span className="text-gray-700 font-medium">Sign in with Google</span>
                    </button>

                    {/* Sign Up Prompt */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => router.push('/register')}
                                className="text-[#FE9900] hover:text-[#E5890A] font-semibold transition-colors hover:underline"
                            >
                                Create account
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        By signing in, you agree to our{' '}
                        <button className="text-[#FE9900] hover:underline">Terms of Service</button>
                        {' '}and{' '}
                        <button className="text-[#FE9900] hover:underline">Privacy Policy</button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
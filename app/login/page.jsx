'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Logging from "@/components/loaders/Logging";



const LoginPage = () => {
    const [error, setError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) =>{
        setFormData((prev)=> ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }
     
    const handleSubmit = async(e) =>{
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // const res = await fetch('/api/login', {
            //     method:'POST',
            //     headers:{'Content-Type': 'application/json'},
            //     credentials:'include',
            //     body:JSON.stringify(formData)
            // })

            const res = await signIn('credentials', {
              redirect: false,
              email: formData.email,
              password: formData.password,
              callbackUrl,
            });
            // const data = await res.json()

            if (res.error) {
      // NextAuth sends "CredentialsSignin" by default on invalid login
            if (res.error === "CredentialsSignin") {
              setError("Invalid email or password");
            } else {
              setError(res.error);
            }
            } else if(res.ok){
                toast.success('Login Successful')
                router.refresh()
                 if (res.url) {
                router.push(res.url);
              }
              else router.push(callbackUrl);
            }
            
        } catch (error) {
           setError(error.message) 
        } finally{
            setLoading(false)
        }
    };
    const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl });
   }; 

    return (  <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-8 space-y-6">
        {/* Company Name */}
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#002D62]">
          Lemufex Engineering Group (LEG)
        </h1>

        {/* Error Display */}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {['email', 'password'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type={field === 'password' ? 'password' : 'email'}
                id={field}
                placeholder={field === 'email' ? 'you@example.com' : ''}
                className="mt-1 px-4 py-2 w-full border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                onChange={handleChange}
                value={formData[field]}
                required
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#FE9900] hover:bg-[#e88500] text-white font-semibold rounded-md transition duration-200"
          >
            {loading ? <Logging/> : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <hr className="flex-grow border-t" />
          <span className="text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-t" />
        </div>

        {/* Google Button */}
        <button
          onClick={( handleGoogleLogin)}
          className="w-full py-2 flex items-center justify-center gap-2 border rounded-md hover:bg-gray-100"
        >
          <FcGoogle size={20} />
          <span className="text-gray-700">Sign in with Google</span>
        </button>

        {/* Sign Up Prompt */}
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <span
            onClick={() => router.push('/register')}
            className="text-[#FE9900] font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

         <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 bg-[#FE9900]" />
              <span className=" text-gray-900">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-[#FE9900] hover:underline">Forgot password?</a>
          </div>
      </div>
    </div> );
}
 
export default LoginPage;



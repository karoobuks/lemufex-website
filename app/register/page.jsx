'use client'
 import { useState } from "react"
 import {FcGoogle} from 'react-icons/fc'
 import { useRouter } from "next/navigation"
 import toast from "react-hot-toast"
 import { signIn } from "next-auth/react"
 import Registering from "@/components/loaders/Registering"


 const RegisterPage = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        firstName:'',
        lastName: '',
        email: '',
        password: '',
        phone: '',
    
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) =>{
        setFormData((prev) =>({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/register', {
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(formData),
            })

            const data = await res.json()
            if(res.ok){
                toast.success('Registration Successful')
                router.push('/login')
            }
        } catch (error) {
            console.error('Registration Failed:', error)
            setError('Registration Failed, something went wrong')
        } finally{
            setLoading(false)
        }
    }
     const handleGoogleSignup = () => {
    signIn('google', { callbackUrl: '/' });
    };

    return ( <div className="min-h-screen  flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-8 space-y-6">
            <h1 className="text-center text-2xl md:text-3xl font-bold text-[#002D62]">Create an account with Lemufex Engineering Group</h1>

             {/* Google Button */}
        <button
          onClick={(handleGoogleSignup)}
          className="w-full py-2 flex items-center justify-center gap-2 border rounded-md hover:bg-gray-100"
        >
          <FcGoogle size={20} />
          <span className="text-gray-700">Continue in with Google</span>
        </button>

          {/* Divider */}
        <div className="flex items-center gap-4">
          <hr className="flex-grow border-t" />
          <span className="text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-t" />
        </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 ">
                {['firstName', 'lastName', 'email', 'password', 'phone'].map((field) =>(
                    <div key={field} >
                        <label htmlFor={field}
                        className="block text-sm font-medium text-gray-700 capitalize">
                            {field}
                        </label>
                        <input 
                        type={field === 'password'  ? 'password' : 'text'}
                        id={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="mt-1 px-4 py-2 w-full text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                        placeholder={field === 'email' ? 'You@example.com' : ''}
                        required
                        />
                    </div>
                ))}

                <button type="submit"
                className="w-full py-2 bg-[#FE9900] hover:bg-[#e88500] text-white font-semibold rounded-md transition duration-200"
                disabled={loading}>
                    {loading ? <Registering className="font-bold"/> : 'Sign Up'}
                </button>
            </form>

                {/* Sign Up Prompt */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-[#FE9900] font-semibold cursor-pointer hover:underline"
          >
            Log In
          </span>
        </p>
        </div>

    </div> );
 }
  
 export default RegisterPage;
'use client'
import { useState } from "react"

export default function ForgotPasswordPage(){
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
   try{
    const res = await fetch('/api/account/forgot-password', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ email })
    })

    const data = await res.json()
    if(res.ok){
        setMessage(data.message);
        setError('')
    } else{
        setError(data.message)
    }
     } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  };
  
  return(
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email"
            className="w-full border p-2 rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />

              <button className="w-full bg-[#FE9900] text-white p-2 rounded hover:bg-amber-400" type="submit" disabled={loading} >
          Send Reset Link
        </button>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        </form>
    </div>
  )
}
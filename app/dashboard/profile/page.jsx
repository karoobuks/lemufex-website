'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { FaArrowLeft } from "react-icons/fa"
import ProfileHeader from "@/components/trainee-profile/ProfileHeader" 
import PersonalInfo from "@/components/trainee-profile/PersonalInfo"
import AccountDetails from "@/components/trainee-profile/AccountDetails" 
import PaymentSection from "@/components/trainee-profile/PaymentSection"
import DocumentsSection from "@/components/trainee-profile/DocumentSection"
import SupportSection from "@/components/trainee-profile/SupportSection"
import LemLoader from "@/components/loaders/LemLoader"
import toast from "react-hot-toast"

export default function ProfilePage() {
  const [trainee, setTrainee] = useState({})
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = session?.user?.id

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true)
        
        const [traineeRes, meRes] = await Promise.all([
          fetch(`/api/trainee/${userId}`),
          fetch(`/api/me`, { cache: "no-store" })
        ])

        if (traineeRes.ok) {
          const traineeData = await traineeRes.json()
          setTrainee(traineeData.data)
        }

        if (meRes.ok) {
          const meData = await meRes.json()
          setMe(meData)
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // Handle payment status from URL params
  useEffect(() => {
    const payment = searchParams.get('payment')
    const reference = searchParams.get('reference')
    
    if (payment === 'completed') {
      toast.success('Payment completed successfully!')
      // Clean URL
      router.replace('/dashboard/profile', { scroll: false })
    } else if (payment === 'failed') {
      toast.error('Payment failed. Please try again.')
      // Clean URL
      router.replace('/dashboard/profile', { scroll: false })
    }
  }, [searchParams, router])

  if (loading) return <LemLoader />

  const userInfo = {
    name: trainee?.fullName || session?.user?.firstName || 'User',
    imageUrl: trainee?.image || '',
    email: trainee?.email || session?.user?.email || '',
    phone: trainee?.phone || '',
    address: trainee?.address || '',
    course: trainee?.course || '',
    documents: trainee?.documents || [],
    dob: trainee?.dob ? new Date(trainee.dob).toLocaleDateString() : '',
    emergencyContact: trainee?.emergencycontact || '',
  }

  const accountInfo = {
    username: session?.user?.firstName || trainee?.fullName?.split(' ')[0] || 'User',
    createdAt: trainee?.createdAt
      ? new Date(trainee.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '',
    status: trainee?.status || 'Active',
    hasPassword: me?.hasPassword ?? false,
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header Navigation */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[#002B5B] hover:text-[#FE9900] mb-4 transition-colors"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-[#002B5B]">My Profile</h1>
          <p className="text-[#555]">Manage your account information and settings</p>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          <ProfileHeader 
            name={userInfo.name} 
            imageUrl={userInfo.imageUrl}
            onImageUpdate={(newImageUrl) => {
              setTrainee(prev => ({ ...prev, image: newImageUrl }))
            }}
          />
          <PersonalInfo info={userInfo} />
          <AccountDetails details={accountInfo} />
          <PaymentSection 
            key={searchParams.get('payment')} 
            courseId={trainee?.trainings?.[0]?.course || null}
            track={trainee?.trainings?.[0]?.track || trainee?.course || 'Software Programming'}
          />
          <DocumentsSection documents={userInfo.documents} />
          <SupportSection />
        </div>
      </div>
    </div>
  )
}
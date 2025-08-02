'use client'
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { useSession, signIn, signOut } from 'next-auth/react';
import toast from "react-hot-toast";



const Navbar = () => {
    
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession();

    useEffect(() =>{
        const fetchUser = async () =>{
            try {
                const res = await fetch('/api/me', { credentials:'include' });
                const data = await res.json();
                if( data && data._id) setUser(data);
            } catch (err) {
                console.error('Failed to looad to user:', err);
            } finally {
                setLoading(false)
            }
        }
        fetchUser()

        
    }, [])

    const handleLogOut = async()=>{
        try {
            await fetch('/api/logout',{
                method:'POST',
                credentials:'include'
            })
            toast.success("You've been logged out")
            signOut({callbackUrl:'/'})
        } catch (error) {
            toast.error('Failed to Log out')
            console.error('Logout error:', error)
        }
    };


    return (
         <nav className="bg-[#FE9900] shadow-md sticky top-0 left-0 w-full z-50 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
                <div className="flex justify-between  items-center">
                    <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 text-gray-100 font-semibold text-lg">
                    <Image 
                    
                    className="rounded-xl font-bold" 
                    alt="Logo" 
                    height={40} 
                    width={40} 
                    /> 
                    <span className="text-lg sm:text-xl  md:text-2xl font-bold text-[#002B5B]">Lemufex Engineering Group(LEG)</span></Link>
                    </div>

                    <div className=" hidden md:flex  items-center font-bold gap-6">
                        <Link href="/" className={`${pathname === '/'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} hover:text-gray-700`}>Home</Link>
                        { user && user.isTrainee === true  && (
                            <Link href="/dashboard" className={`${pathname === '/dashboard'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} hover:text-gray-700`}>Dashboard</Link>
                        )}
                        <Link href="/services" className={`${pathname === '/services'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} hover:text-gray-700`}>Services</Link>
                        <Link href="/why-choose-us" className={`${pathname === '/why-choose-us'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} hover:text-gray-700`}>Why Choose Us</Link>
                        <Link href="/about" className={`${pathname === '/about'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} hover:text-gray-700`}>About</Link>
                        <Link href="/contact" className={`${pathname === '/contact'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} hover:text-gray-700`}>Contact</Link>
                        {!session ?  (
                        <button onClick={() => signIn()}  className=" text-[#E5E7EB] block hover:text-gray-700 text-base font-bold py-4 px-2">Login</button>
                        )
                        : (
                        <button onClick={(handleLogOut)}  className=" text-[#E5E7EB] block hover:text-gray-700 text-base font-medium py-4 px-2">Sign Out</button>
                        )}
                    </div>
                   <div className=" md:hidden ml-auto sm:block  text-[#002B5B]  ">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen? <FaTimes size={30}/> : <FaBars size={30}/> }
                        </button>
                </div>
                
                </div>
                     
                     {isMobileMenuOpen  && (
        <div className="relative md:hidden">    
                    <ul className={`transition-all duration-300 bg-[#FE9900] w-full  left-0 z-50 ${isMobileMenuOpen ? 'opacity-100 max-h-screen py-6' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <li><Link href="/" className={`block text-base font-medium py-4 px-2 ${pathname === '/' ? 'text-gray-700' : 'text-[#E5E7EB]'}`}>Home</Link></li>
                        <li> <Link href="/services" className={`${pathname === '/services'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} block hover:text-gray-700 text-base font-medium py-4 px-2`}>Services</Link></li>
                        <li> <Link href="/why-choose-us" className={`${pathname === '/why-choose-us'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} block hover:text-gray-700 text-base font-medium py-4 px-2`}>Why Choose Us</Link></li>
                        <li><Link href="/about" className={`${pathname === '/about'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} block hover:text-gray-700 text-base font-medium py-4 px-2`}>About</Link></li>
                        <li> <Link href="/contact" className={`${pathname === '/contact'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} block hover:text-gray-700 text-base font-medium py-4 px-2`}>Contact</Link></li>
                        {  !session ? (
                        <li> <button onClick={() => signIn()}   className=" text-[#E5E7EB] block hover:text-gray-700 text-base font-medium py-4 px-2">Login</button></li>
                        ) :
                          (
                        <li> <button onClick={(handleLogOut)}  className=" text-[#E5E7EB] block hover:text-gray-700 text-base font-medium py-4 px-2">Sign Out</button></li>
                        )}
                    </ul> 
                    
        </div>
        )}
            </div>
    </nav>
     );
}
 
export default Navbar;




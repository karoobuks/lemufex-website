'use client'
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaTimes, FaBars, FaCircle } from "react-icons/fa";
import { useSession, signIn, signOut } from 'next-auth/react';
import toast from "react-hot-toast";
import {HiOutlineChevronDown} from 'react-icons/hi'
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { MdDashboard, MdBuild, MdMiscellaneousServices  } from "react-icons/md";
import {FiLogIn, FiLogOut }from "react-icons/fi"
import Logo from "@/assets/images/lemufexbr.png"





const Navbar = () => {
    
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession();
    const [isAboutUsOpen, setIsAboutUsOpen] = useState(false)
    const aboutUsRef = useRef(null)

    

     const userId = session?.user?.id;

    const toggleAboutUs = () =>{
        setIsAboutUsOpen((prev) => !prev);
    }

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

         const handleClickOutside = (event) =>{
            if(
                aboutUsRef.current &&
                !aboutUsRef.current.contains(event.target)
            ){
                setIsAboutUsOpen(false)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };

        
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
                    src={Logo}
                    className="rounded-xl bg-[#002B5B] font-bold" 
                    alt="Logo" 
                    height={40} 
                    width={40} 
                    /> 
                    <span className="text-lg sm:text-xl  md:text-2xl font-bold text-[#002B5B]">Lemufex Group</span></Link>
                    </div>
                        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                    <div className=" hidden md:flex  items-center font-bold gap-6">
                        <Link href="/" className={`${pathname === '/'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'}  flex items-center gap-1 align-baseline hover:text-gray-700`}> <FaHome className="text-lg"/>  Home</Link>
                        { (session?.user?.role === "admin" || session?.user?.isTrainee === true)  && (
                            <Link href={`/dashboard`} className={`${pathname === `/dashboard`? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} flex items-center gap-1 align-baseline hover:text-gray-700`}> <MdDashboard className="text-lg"/> Dashboard</Link>
                        )}
                        

                        <Link href="/services" className={`${pathname === '/services'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} flex items-center gap-1 hover:text-gray-700`}> <MdMiscellaneousServices className="text-lg"/>  Services</Link>
                        <div className="relative group" ref={aboutUsRef}>
                        <button onClick={toggleAboutUs} className={`text-gray-700 hover:text-[#FE9900] dark:text-[#E5E7EB] dark:hover:text-[#002B5B] flex items-center gap-1 align-baseline `}><FaInfoCircle className="text-lg"/>About Us <HiOutlineChevronDown /> </button>
                        {isAboutUsOpen && (
                            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#1E2A38] shadow-xl rounded-lg border border-gray-200 z-50">
                                <ul className="py-1">
                                    <li>
                                         <Link href="/why-choose-us" onClick={() =>setIsAboutUsOpen(false)}  className="flex items-center gap-2 py-4 px-2 text-sm text-[#1A1A1A] dark:text-[#E5E7EB] hover:bg-[#FE9900]/10 hover:text-[#FE9900] transition-all" >Why Choose Us</Link>
                                    </li>
                                    <li>
                                         <Link href="/about" onClick={() =>setIsAboutUsOpen(false)} className="flex items-center gap-2 py-4 px-2 text-sm text-[#1A1A1A] dark:text-[#E5E7EB] hover:bg-[#FE9900]/10 hover:text-[#FE9900] transition-all">About</Link>
                                    </li>
                                    <li>
                                         <Link href="/faq" onClick={() =>setIsAboutUsOpen(false)} className="flex items-center gap-2 py-4 px-2 text-sm text-[#1A1A1A] dark:text-[#E5E7EB] hover:bg-[#FE9900]/10 hover:text-[#FE9900] transition-all">FAQs</Link>
                                    </li>
                                    <li>
                                         <Link href="/contact" onClick={() =>setIsAboutUsOpen(false)} className="flex items-center gap-2 py-4 px-2 text-sm text-[#1A1A1A] dark:text-[#E5E7EB] hover:bg-[#FE9900]/10 hover:text-[#FE9900] transition-all">Contact</Link>
                                    </li>
                                </ul>

                            </div>
                        )}
                        </div>
                       
                        
                        
                        {!session ?  (
                        <button onClick={() => signIn()}  className="border border-[#002B5B] text-white px-6 py-3 font-semibold bg-[#1E2A38] rounded-lg hover:bg-[#1E2A38] hover:text-[#FE9900] flex items-center gap-1 align-baseline transition"><FiLogIn/> Login</button>
                        )
                        : (
                        <button onClick={(handleLogOut)}  className="border border-[#002B5B] text-white px-6 py-3 font-semibold bg-[#1E2A38] rounded-lg hover:bg-[#1E2A38] hover:text-[#FE9900] flex items-center gap-1 align-baseline transition"><FiLogOut/> Sign Out</button>
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
                        <li><Link href="/" className={`block text-base font-medium py-4 px-2 ${pathname === '/' ? 'text-gray-700' : 'text-[#E5E7EB]'}  block hover:text-gray-700 text-base font-medium py-4 px-2`}>Home</Link></li>
                        { (session?.user?.role === "admin" || session?.user?.isTrainee === true ) && (
                        <li><Link href={`/dashboard`} className={`block text-base font-medium py-4 px-2 ${pathname === `/dashboard` ? 'text-gray-700' : 'text-[#E5E7EB]'}  block hover:text-gray-700 text-base font-medium py-4 px-2`}>Dashboard</Link></li>
                        )}
                        <li> <Link href="/services" className={`${pathname === '/services'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} block hover:text-gray-700 text-base font-medium py-4 px-2`}>Services</Link></li>
                        <li> <Link href="/why-choose-us" className={`${pathname === '/why-choose-us'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} block hover:text-gray-700 text-base font-medium py-4 px-2`}>Why Choose Us</Link></li>
                        <li><Link href="/about" className={`${pathname === '/about'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} block hover:text-gray-700 text-base font-medium py-4 px-2`}>About</Link></li>
                        <li><Link href="/faq" className={`${pathname === '/faq'? 'text-gray-700 hover:text-[#E5E7EB]' : 'text-[#E5E7EB]'} block hover:text-gray-700 text-base font-medium py-4 px-2`}>FAQs</Link></li>
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




'use client'

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"
import AuthProvider from "./AuthProvider"



const LayoutWrapper = ({children}) => {
    const pathname = usePathname()
    const noHeaderFooter = ['/login', '/register']
    const showHeaderFooter = !noHeaderFooter.includes(pathname)
    return ( 
       
        <AuthProvider>
        <>
        {showHeaderFooter && <Navbar/>}
        {children}
        {showHeaderFooter && <Footer/>}
        </>
        </AuthProvider>
        
     );
}
 
export default LayoutWrapper;
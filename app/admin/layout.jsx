"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { 
    FiUsers, 
    FiCreditCard, 
    FiBookOpen, 
    FiCalendar, 
    FiSettings, 
    FiMenu,
    FiX,
    FiMessageCircle,
    FiMail
} from "react-icons/fi"
import {FaFolderOpen, FaGraduationCap} from "react-icons/fa"

export default function AdminLayout({ children }){
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth < 768) {
                setIsCollapsed(true)
            }
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const menuItems = [
        { href: "/admin/users", icon: FiUsers, label: "Users" },
        { href: "/admin/trainees", icon: FaGraduationCap, label: "Trainees" },
        { href: "/admin/payments", icon: FiCreditCard, label: "Payments" },
        { href: "/admin/update-courses", icon: FiBookOpen, label: "Courses" },
        { href: "/admin/schedule", icon: FiCalendar, label: "Schedules" },
        { href: "/admin/resources", icon: FaFolderOpen, label: "Resources" },
        { href: "/admin/newsletter", icon: FiMail, label: "Newsletter" },
        { href: "/admin/chat", icon: FiMessageCircle, label: "Support Chat" },
        { href: "/admin/settings", icon: FiSettings, label: "Settings" }
    ]

    const handleMenuItemClick = () => {
        if (isMobile) {
            setIsMobileMenuOpen(false)
        }
    }

    return(
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1F2937] text-white rounded-lg shadow-lg"
                aria-label="Toggle mobile menu"
            >
                {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                ${isMobile 
                    ? `fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50 ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`
                    : `${isCollapsed ? 'w-16' : 'w-64'} fixed top-[64px] left-0 h-[calc(100vh-64px)]`
                } 
                bg-[#1F2937] text-white flex flex-col transition-all duration-300 ease-in-out shadow-xl
            `}>
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    {(!isCollapsed || isMobile) && (
                        <div className="text-lg md:text-xl font-bold text-[#FE9900] truncate">
                            Lemufex Admin
                        </div>
                    )}
                    {!isMobile && (
                        <button 
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
                        </button>
                    )}
                </div>
                
                <nav className="flex-1 py-4 overflow-y-auto">
                    <div className="space-y-1 px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            
                            return (
                                <Link 
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleMenuItemClick}
                                    className={`
                                        flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                                        ${isActive 
                                            ? 'bg-[#FE9900] text-[#002B5B] font-semibold shadow-lg' 
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }
                                        ${isCollapsed && !isMobile ? 'justify-center' : ''}
                                    `}
                                    title={isCollapsed && !isMobile ? item.label : ''}
                                >
                                    <Icon size={20} className="flex-shrink-0" />
                                    {(!isCollapsed || isMobile) && (
                                        <span className="truncate">{item.label}</span>
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <main className={`
                    flex-1 p-3 sm:p-4 md:p-6 transition-all duration-300 ease-in-out
                    ${isMobile 
                        ? 'ml-0 mt-16' 
                        : isCollapsed 
                            ? 'ml-16' 
                            : 'ml-64'
                    }
                `}>
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
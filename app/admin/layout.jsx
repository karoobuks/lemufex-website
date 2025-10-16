"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { 
    FiUsers, 
     
    FiCreditCard, 
    FiBookOpen, 
    FiCalendar, 
     
    FiSettings, 
    FiMenu,
    FiX,
    FiMessageCircle
} from "react-icons/fi"
import {FaFolderOpen, FaGraduationCap} from "react-icons/fa"

export default function AdminLayout({ children }){
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const menuItems = [
        { href: "/admin/users", icon: FiUsers, label: "Users" },
        { href: "/admin/trainees", icon: FaGraduationCap, label: "Trainees" },
        { href: "/admin/payments", icon: FiCreditCard, label: "Payments" },
        { href: "/admin/update-courses", icon: FiBookOpen, label: "Courses" },
        { href: "/admin/schedule", icon: FiCalendar, label: "Schedules" },
        { href: "/admin/resources", icon: FaFolderOpen, label: "Resources" },
        { href: "/admin/chat", icon: FiMessageCircle, label: "Support Chat" },
        { href: "/admin/settings", icon: FiSettings, label: "Settings" }
    ]

    return(
        <div className="flex min-h-screen bg-gray-50">
            <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-[#1F2937] text-white flex flex-col fixed top-[64px] left-0 h-[calc(100vh-64px)] transition-all duration-300 ease-in-out shadow-xl z-40`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    {!isCollapsed && (
                        <div className="text-xl font-bold text-[#FE9900] truncate">
                            Lemufex Admin
                        </div>
                    )}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
                    </button>
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
                                    className={`
                                        flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                                        ${isActive 
                                            ? 'bg-[#FE9900] text-[#002B5B] font-semibold shadow-lg' 
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }
                                        ${isCollapsed ? 'justify-center' : ''}
                                    `}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <Icon size={20} className="flex-shrink-0" />
                                    {!isCollapsed && (
                                        <span className="truncate">{item.label}</span>
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col">
                <main className={`flex-1 p-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
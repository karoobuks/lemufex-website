"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import TypingDots from "@/components/loaders/TypingDots"
import {
  FiUsers,
  FiSearch,
  FiUser,
  FiMail,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiDownload,
  FiEye,
  FiX,
  FiPhone,
  FiMapPin,
  FiShield
} from "react-icons/fi"

export default function UsersPage() {
    const { data: session, status } = useSession()
    const [users, setUsers] = useState([])
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [searchInput, setSearchInput] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [imageViewer, setImageViewer] = useState({ show: false, src: '', name: '' })

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/admin/users?page=${page}&search=${search}&role=${roleFilter}`)
                const data = await res.json()
                
                if (data.success !== false) {
                    setUsers(data.users || [])
                    setPagination(data.pagination || {})
                } else {
                    toast.error("Failed to fetch users")
                }
            } catch (error) {
                toast.error("Error loading users")
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [page, search, roleFilter])

    const handleSearch = () => {
        setSearch(searchInput)
        setPage(1)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const exportUsers = async () => {
        try {
            const csvContent = [
                ['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined Date'],
                ...users.map(user => [
                    `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
                    user.email || '',
                    user.phone || 'N/A',
                    user.role || 'user',
                    user.disabled ? 'Disabled' : 'Active',
                    new Date(user.createdAt).toLocaleDateString()
                ])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users-${roleFilter}-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Users exported successfully!');
        } catch (error) {
            toast.error("Export failed")
        }
    }

    const viewUser = (user) => {
        setSelectedUser(user)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedUser(null)
    }

    const openImageViewer = (src, name) => {
        setImageViewer({ show: true, src, name })
    }

    const closeImageViewer = () => {
        setImageViewer({ show: false, src: '', name: '' })
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <TypingDots />
            </div>
        )
    }

    if (session?.user?.role !== "admin") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h2>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#FE9900] rounded-lg">
                        <FiUsers className="text-white" size={20} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
                </div>
                <p className="text-gray-600">Manage and monitor all registered users</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                    {/* Search */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FiSearch size={16} />
                            Search Users
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-600 placeholder:font-medium"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                onClick={handleSearch}
                                className="flex items-center justify-center gap-2 bg-[#FE9900] hover:bg-[#E5890A] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base"
                            >
                                <FiSearch size={16} />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters and Export */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {/* Role Filter */}
                        <div className="flex-1 space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FiFilter size={16} />
                                Filter by Role
                            </label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 font-semibold text-gray-800"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="trainee">Trainee</option>
                            </select>
                        </div>

                        {/* Export Button */}
                        <div className="flex items-end">
                            <button
                                onClick={exportUsers}
                                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
                            >
                                <FiDownload size={16} />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <FiUsers className="text-[#FE9900]" size={18} />
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            Users List
                            {pagination.total && (
                                <span className="text-xs sm:text-sm font-normal text-gray-500 ml-2 block sm:inline">
                                    ({pagination.total} total)
                                </span>
                            )}
                        </h3>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <TypingDots />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500 text-lg">No users found.</p>
                        <p className="text-gray-400 text-sm">
                            {search ? "Try adjusting your search criteria." : "Users will appear here once they register."}
                        </p>
                    </div>
                ) : (
                    <>
                    {/* Mobile Card View */}
                    <div className="block sm:hidden">
                        {users.map((user) => (
                            <div key={user._id} className="p-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {user.profilePicture || user.image || user.avatar ? (
                                                <img
                                                    src={user.profilePicture || user.image || user.avatar}
                                                    alt={`${user.firstName} ${user.lastName}` || 'User'}
                                                    className="h-10 w-10 rounded-full object-cover border-2 border-[#FE9900] cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => openImageViewer(user.profilePicture || user.image || user.avatar, `${user.firstName} ${user.lastName}`)}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'
                                                        e.target.parentNode.querySelector('.fallback-avatar').style.display = 'flex'
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`fallback-avatar h-10 w-10 rounded-full bg-[#FE9900] flex items-center justify-center ${(user.profilePicture || user.image || user.avatar) ? 'hidden' : 'flex'}`}>
                                                <span className="text-white font-semibold text-sm">
                                                    {user.firstName?.charAt(0)?.toUpperCase() || user.lastName?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                        </div>
                                    </div>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                                        user.role === 'admin' 
                                            ? 'bg-red-100 text-red-800'
                                            : user.role === 'trainee'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</span>
                                    <button 
                                        onClick={() => viewUser(user)}
                                        className="flex items-center gap-1 text-[#FE9900] hover:text-[#E5890A] transition-colors duration-200 p-2"
                                    >
                                        <FiEye size={14} />
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <FiUser size={14} />
                                            User
                                        </div>
                                    </th>
                                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <FiMail size={14} />
                                            Contact
                                        </div>
                                    </th>
                                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <FiShield size={14} />
                                            Role
                                        </div>
                                    </th>
                                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar size={14} />
                                            Joined
                                        </div>
                                    </th>
                                    <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                                    {user.profilePicture || user.image || user.avatar ? (
                                                        <img
                                                            src={user.profilePicture || user.image || user.avatar}
                                                            alt={`${user.firstName} ${user.lastName}` || 'User'}
                                                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-[#FE9900] cursor-pointer hover:opacity-80 transition-opacity"
                                                            onClick={() => openImageViewer(user.profilePicture || user.image || user.avatar, `${user.firstName} ${user.lastName}`)}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none'
                                                                e.target.parentNode.querySelector('.fallback-avatar').style.display = 'flex'
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className={`fallback-avatar h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#FE9900] flex items-center justify-center ${(user.profilePicture || user.image || user.avatar) ? 'hidden' : 'flex'}`}>
                                                        <span className="text-white font-semibold text-xs sm:text-sm">
                                                            {user.firstName?.charAt(0)?.toUpperCase() || user.lastName?.charAt(0)?.toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-2 sm:ml-4 min-w-0">
                                                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                        {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 md:hidden truncate">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 hidden md:table-cell">
                                            <div className="text-xs sm:text-sm text-gray-900 max-w-[150px] truncate">{user.email}</div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.role === 'admin' 
                                                    ? 'bg-red-100 text-red-800'
                                                    : user.role === 'trainee'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm font-medium">
                                            <button 
                                                onClick={() => viewUser(user)}
                                                className="flex items-center gap-1 text-[#FE9900] hover:text-[#E5890A] transition-colors duration-200 p-1"
                                            >
                                                <FiEye size={14} />
                                                <span className="hidden sm:inline">View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {!loading && users.length > 0 && pagination.pages > 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                            Page {pagination.page} of {pagination.pages}
                            {pagination.total && (
                                <span className="block sm:inline sm:ml-1">({pagination.total} total)</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <FiChevronLeft size={14} />
                                <span className="hidden sm:inline">Previous</span>
                            </button>
                            <span className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 rounded-lg">
                                {page}
                            </span>
                            <button
                                disabled={page >= pagination.pages}
                                onClick={() => setPage(page + 1)}
                                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <FiChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full relative">
                                    {selectedUser.profilePicture || selectedUser.image || selectedUser.avatar ? (
                                        <img
                                            src={selectedUser.profilePicture || selectedUser.image || selectedUser.avatar}
                                            alt={`${selectedUser.firstName} ${selectedUser.lastName}` || 'User'}
                                            className="h-12 w-12 rounded-full object-cover border-2 border-[#FE9900] cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => openImageViewer(selectedUser.profilePicture || selectedUser.image || selectedUser.avatar, `${selectedUser.firstName} ${selectedUser.lastName}`)}
                                            onError={(e) => {
                                                e.target.style.display = 'none'
                                                e.target.parentNode.querySelector('.fallback-avatar').style.display = 'flex'
                                            }}
                                        />
                                    ) : null}
                                    <div className={`fallback-avatar h-12 w-12 rounded-full bg-[#FE9900] flex items-center justify-center ${(selectedUser.profilePicture || selectedUser.image || selectedUser.avatar) ? 'hidden' : 'flex'}`}>
                                        <span className="text-white font-bold text-lg">
                                            {selectedUser.firstName?.charAt(0)?.toUpperCase() || selectedUser.lastName?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                                    <p className="text-sm text-gray-500">{`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()}</p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <FiX size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Personal Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiUser size={18} className="text-[#FE9900]" />
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">First Name</label>
                                        <p className="text-gray-900">{selectedUser.firstName || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Last Name</label>
                                        <p className="text-gray-900">{selectedUser.lastName || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <FiMail size={14} className="text-gray-400" />
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Phone</label>
                                        <p className="text-gray-900 flex items-center gap-2">
                                            <FiPhone size={14} className="text-gray-400" />
                                            {selectedUser.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Role</label>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            selectedUser.role === 'admin' 
                                                ? 'bg-red-100 text-red-800'
                                                : selectedUser.role === 'trainee'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {selectedUser.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiCalendar size={18} className="text-[#FE9900]" />
                                    Account Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Date Joined</label>
                                        <p className="text-gray-900">
                                            {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                        <p className="text-gray-900">
                                            {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">User ID</label>
                                        <p className="text-gray-900 font-mono text-sm">{selectedUser._id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            {(selectedUser.address || selectedUser.course) && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiMapPin size={18} className="text-[#FE9900]" />
                                        Additional Information
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {selectedUser.address && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-500">Address</label>
                                                <p className="text-gray-900">{selectedUser.address}</p>
                                            </div>
                                        )}
                                        {selectedUser.course && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-500">Course</label>
                                                <p className="text-gray-900">{selectedUser.course}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
                            <button
                                onClick={closeModal}
                                className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Viewer Modal */}
            {imageViewer.show && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-2 sm:p-4"
                    onClick={closeImageViewer}
                >
                    <div className="relative max-w-4xl max-h-full w-full">
                        <button
                            onClick={closeImageViewer}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 z-10 p-2 bg-black bg-opacity-50 rounded-full"
                        >
                            <FiX size={20} className="sm:w-8 sm:h-8" />
                        </button>
                        <img
                            src={imageViewer.src}
                            alt={imageViewer.name}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        />
                        {imageViewer.name && (
                            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 text-center">
                                <p className="text-white text-sm sm:text-lg font-medium bg-black bg-opacity-50 rounded-lg px-2 py-1 sm:px-4 sm:py-2">
                                    {imageViewer.name}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import TypingDots from "@/components/loaders/TypingDots"
import {
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiSearch,
  FiFilter,
  FiEye,
  FiCheck,
  FiX,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiMail,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi"

export default function AdminPaymentsPage() {
  const { data: session, status } = useSession()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/payments?page=${page}&search=${search}&status=${statusFilter}`)
        const data = await res.json()
        
        if (data.success !== false) {
          console.log('Received payments data:', data.payments);
          console.log('Sample payment:', data.payments?.[0]);
          setPayments(data.payments || data || [])
          setPagination(data.pagination || {})
        } else {
          toast.error("Failed to fetch payments")
        }
      } catch (error) {
        toast.error("Error loading payments")
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [page, search, statusFilter])

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const exportPayments = async () => {
    try {
      const csvContent = [
        ['Trainee Name', 'Email', 'Course', 'Amount', 'Payment Type', 'Status', 'Date', 'Reference'],
        ...payments.map(payment => [
          payment.userId && typeof payment.userId === 'object' 
            ? `${payment.userId.firstName || ''} ${payment.userId.lastName || ''}`.trim() || 'N/A'
            : 'N/A',
          (payment.userId && typeof payment.userId === 'object' ? payment.userId.email : null) || payment.email || 'N/A',
          payment.course && typeof payment.course === 'object' ? payment.course.name : 'N/A',
          `₦${(payment.amount || 0).toLocaleString()}`,
          payment.paymentType || 'N/A',
          payment.status || 'N/A',
          payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A',
          payment.reference || 'N/A'
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${statusFilter}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Payments exported successfully!');
    } catch (error) {
      toast.error("Export failed")
    }
  }

  const viewPayment = (payment) => {
    setSelectedPayment(payment)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPayment(null)
  }

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setPayments(prev => prev.map(p => 
          p._id === paymentId ? { ...p, status: newStatus } : p
        ))
        toast.success(`Payment ${newStatus.toLowerCase()} successfully`)
      } else {
        toast.error("Failed to update payment status")
      }
    } catch (error) {
      toast.error("Error updating payment")
    }
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

  // Summary Metrics
  const totalCollected = payments
    .filter((p) => p.status === "success" || p.status === "completed")
    .reduce((acc, p) => acc + (p.amount || 0), 0)

  const pendingCount = payments.filter((p) => p.status === "pending").length
  const failedCount = payments.filter((p) => p.status === "failed").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#FE9900] rounded-lg">
            <FiCreditCard className="text-white" size={20} />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Payment Management</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Monitor and manage all payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="text-green-600" size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-gray-500">Total Collected</h2>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-green-600">₦{totalCollected.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-600" size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-gray-500">Pending Payments</h2>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg">
              <FiXCircle className="text-red-600" size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-gray-500">Failed Payments</h2>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-red-600">{failedCount}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiSearch size={16} />
              Search Payments
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Search by name, email, or course..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-700 placeholder:font-semibold"
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
            {/* Status Filter */}
            <div className="flex-1 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiFilter size={16} />
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 font-semibold text-gray-800"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <button
                onClick={exportPayments}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                <FiDownload size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FiCreditCard className="text-[#FE9900]" size={18} />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Payments List
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
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <FiCreditCard className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No payments found.</p>
            <p className="text-gray-400 text-sm">
              {search ? "Try adjusting your search criteria." : "Payments will appear here once made."}
            </p>
          </div>
        ) : (
          <>
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {payments.map((payment, idx) => (
              <div key={payment._id || idx} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {payment.userId && typeof payment.userId === 'object' 
                        ? `${payment.userId.firstName || ''} ${payment.userId.lastName || ''}`.trim() || 'N/A'
                        : 'N/A'
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      {(payment.userId && typeof payment.userId === 'object' ? payment.userId.email : null) || payment.email || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">₦{(payment.amount || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {(payment.status === "success" || payment.status === "completed") && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="mr-1" size={10} />
                        {payment.status === "completed" ? "Completed" : "Success"}
                      </span>
                    )}
                    {payment.status === "pending" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FiClock className="mr-1" size={10} />
                        Pending
                      </span>
                    )}
                    {payment.status === "failed" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiXCircle className="mr-1" size={10} />
                        Failed
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => viewPayment(payment)}
                    className="text-[#FE9900] hover:text-[#E5890A] p-2"
                  >
                    <FiEye size={16} />
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
                  <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiUser size={12} />
                      <span className="hidden md:inline">Trainee</span>
                    </div>
                  </th>
                  <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <FiMail size={12} />
                      Email
                    </div>
                  </th>
                  <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Course
                  </th>
                  <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiDollarSign size={12} />
                      Amount
                    </div>
                  </th>
                  <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={12} />
                      Date
                    </div>
                  </th>
                  <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment, idx) => (
                  <tr key={payment._id || idx} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-2 lg:px-3 py-2 lg:py-3">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 max-w-[80px] sm:max-w-[120px] truncate">
                        {payment.userId && typeof payment.userId === 'object' 
                          ? `${payment.userId.firstName || ''} ${payment.userId.lastName || ''}`.trim() || 'N/A'
                          : 'N/A'
                        }
                      </div>
                      <div className="text-xs text-gray-500 md:hidden truncate max-w-[100px]">
                        {(payment.userId && typeof payment.userId === 'object' ? payment.userId.email : null) || payment.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-2 lg:px-3 py-2 lg:py-3 hidden md:table-cell">
                      <div className="text-xs sm:text-sm text-gray-900 max-w-[120px] lg:max-w-[150px] truncate">
                        {(payment.userId && typeof payment.userId === 'object' ? payment.userId.email : null) || payment.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-2 lg:px-3 py-2 lg:py-3 hidden lg:table-cell">
                      <div className="text-xs sm:text-sm text-gray-900 max-w-[100px] truncate">
                        {payment.course && typeof payment.course === 'object' ? payment.course.name : 'N/A'}
                      </div>
                    </td>
                    <td className="px-2 lg:px-3 py-2 lg:py-3">
                      <div className="text-xs sm:text-sm font-semibold text-gray-900">
                        ₦{(payment.amount || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-2 lg:px-3 py-2 lg:py-3">
                      {(payment.status === "success" || payment.status === "completed") && (
                        <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1" size={10} />
                          <span className="hidden sm:inline">{payment.status === "completed" ? "Completed" : "Success"}</span>
                          <span className="sm:hidden">✓</span>
                        </span>
                      )}
                      {payment.status === "pending" && (
                        <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FiClock className="mr-1" size={10} />
                          <span className="hidden sm:inline">Pending</span>
                          <span className="sm:hidden">⏳</span>
                        </span>
                      )}
                      {payment.status === "failed" && (
                        <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiXCircle className="mr-1" size={10} />
                          <span className="hidden sm:inline">Failed</span>
                          <span className="sm:hidden">✗</span>
                        </span>
                      )}
                    </td>
                    <td className="px-2 lg:px-3 py-2 lg:py-3 text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-2 lg:px-3 py-2 lg:py-3 text-xs sm:text-sm font-medium">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => viewPayment(payment)}
                          className="text-[#FE9900] hover:text-[#E5890A] transition-colors duration-200 p-1"
                        >
                          <FiEye size={14} />
                        </button>
                        {payment.status === "pending" && (
                          <>
                            <button
                              onClick={() => updatePaymentStatus(payment._id, "success")}
                              className="text-green-600 hover:text-green-700 transition-colors duration-200 p-1 hidden sm:block"
                            >
                              <FiCheck size={14} />
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(payment._id, "failed")}
                              className="text-red-600 hover:text-red-700 transition-colors duration-200 p-1 hidden sm:block"
                            >
                              <FiX size={14} />
                            </button>
                          </>
                        )}
                      </div>
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
      {!loading && payments.length > 0 && pagination.pages > 1 && (
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

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FE9900] rounded-lg">
                  <FiCreditCard className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                  <p className="text-sm text-gray-500">Transaction Information</p>
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
              {/* Payment Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiDollarSign size={18} className="text-[#FE9900]" />
                  Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-gray-900 font-semibold">₦{(selectedPayment.amount || 0).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Payment Method</label>
                    <p className="text-gray-900">{selectedPayment.method || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div>
                      {(selectedPayment.status === "success" || selectedPayment.status === "completed") && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1" size={12} />
                          {selectedPayment.status === "completed" ? "Completed" : "Success"}
                        </span>
                      )}
                      {selectedPayment.status === "pending" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FiClock className="mr-1" size={12} />
                          Pending
                        </span>
                      )}
                      {selectedPayment.status === "failed" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiXCircle className="mr-1" size={12} />
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Course</label>
                    <p className="text-gray-900">
                      {selectedPayment.course && typeof selectedPayment.course === 'object' ? selectedPayment.course.name : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trainee Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser size={18} className="text-[#FE9900]" />
                  Trainee Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">
                      {selectedPayment.userId && typeof selectedPayment.userId === 'object'
                        ? `${selectedPayment.userId.firstName || ''} ${selectedPayment.userId.lastName || ''}`.trim() || 'N/A'
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">
                      {(selectedPayment.userId && typeof selectedPayment.userId === 'object' ? selectedPayment.userId.email : null) || selectedPayment.email || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Payment Date</label>
                    <p className="text-gray-900">
                      {selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedPayment._id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
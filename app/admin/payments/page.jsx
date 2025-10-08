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
      toast.success("Export feature coming soon!")
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#FE9900] rounded-lg">
            <FiCreditCard className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        </div>
        <p className="text-gray-600">Monitor and manage all payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="text-green-600" size={20} />
            </div>
            <h2 className="text-sm font-medium text-gray-500">Total Collected</h2>
          </div>
          <p className="text-2xl font-bold text-green-600">₦{totalCollected.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-600" size={20} />
            </div>
            <h2 className="text-sm font-medium text-gray-500">Pending Payments</h2>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiXCircle className="text-red-600" size={20} />
            </div>
            <h2 className="text-sm font-medium text-gray-500">Failed Payments</h2>
          </div>
          <p className="text-2xl font-bold text-red-600">{failedCount}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex-1 space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiSearch size={16} />
              Search Payments
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name, email, or course..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-600 placeholder:font-medium"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 bg-[#FE9900] hover:bg-[#E5890A] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                <FiSearch size={16} />
                Search
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiFilter size={16} />
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportPayments}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            <FiDownload size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FiCreditCard className="text-[#FE9900]" size={20} />
            <h3 className="text-xl font-bold text-gray-900">
              Payments List
              {pagination.total && (
                <span className="text-sm font-normal text-gray-500 ml-2">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiUser size={12} />
                      Trainee
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiMail size={12} />
                      Email
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiDollarSign size={12} />
                      Amount
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={12} />
                      Date
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment, idx) => (
                  <tr key={payment._id || idx} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                        {payment.userId && typeof payment.userId === 'object' 
                          ? `${payment.userId.firstName || ''} ${payment.userId.lastName || ''}`.trim() || 'N/A'
                          : 'N/A'
                        }
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-[150px] truncate">
                        {(payment.userId && typeof payment.userId === 'object' ? payment.userId.email : null) || payment.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-[100px] truncate">
                        {payment.course && typeof payment.course === 'object' ? payment.course.name : 'N/A'}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ₦{(payment.amount || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {(payment.status === "success" || payment.status === "completed") && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1" size={12} />
                          {payment.status === "completed" ? "Completed" : "Success"}
                        </span>
                      )}
                      {payment.status === "pending" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FiClock className="mr-1" size={12} />
                          Pending
                        </span>
                      )}
                      {payment.status === "failed" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiXCircle className="mr-1" size={12} />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => viewPayment(payment)}
                          className="text-[#FE9900] hover:text-[#E5890A] transition-colors duration-200"
                        >
                          <FiEye size={16} />
                        </button>
                        {payment.status === "pending" && (
                          <>
                            <button
                              onClick={() => updatePaymentStatus(payment._id, "success")}
                              className="text-green-600 hover:text-green-700 transition-colors duration-200"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(payment._id, "failed")}
                              className="text-red-600 hover:text-red-700 transition-colors duration-200"
                            >
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                        <button className="text-gray-600 hover:text-gray-700 transition-colors duration-200">
                          <FiDownload size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && payments.length > 0 && pagination.pages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.page} of {pagination.pages}
              {pagination.total && (
                <span className="ml-1">({pagination.total} total payments)</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FiChevronLeft size={16} />
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                {page}
              </span>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
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
            <div className="p-6 space-y-6">
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
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
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
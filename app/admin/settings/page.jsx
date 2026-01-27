"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import TypingDots from "@/components/loaders/TypingDots"
import {
  FiSettings,
  FiSave,
  FiRefreshCw,
  FiGlobe,
  FiShield,
  FiMail,
  FiCreditCard,
  FiBell,
  FiUsers,
  FiMessageCircle,
  FiBarChart,
  FiServer,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiDownload,
  FiUpload,
  FiFileText
} from "react-icons/fi"

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [unsavedChanges, setUnsavedChanges] = useState({})
  const [showConfirmReset, setShowConfirmReset] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)

  const tabs = [
    { id: "general", label: "General", icon: FiGlobe },
    { id: "system", label: "System", icon: FiServer },
    { id: "security", label: "Security", icon: FiShield },
    { id: "payment", label: "Payment", icon: FiCreditCard },
    { id: "email", label: "Email", icon: FiMail },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "training", label: "Training", icon: FiUsers },
    { id: "chat", label: "Chat", icon: FiMessageCircle },
    { id: "analytics", label: "Analytics", icon: FiBarChart },
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/settings")
      const data = await res.json()
      
      if (data.success) {
        setSettings(data.settings)
      } else {
        toast.error("Failed to load settings")
      }
    } catch (error) {
      toast.error("Error loading settings")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
    
    setUnsavedChanges(prev => ({
      ...prev,
      [activeTab]: true
    }))
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: activeTab,
          settings: settings
        }),
      })

      const data = await res.json()
      
      if (data.success) {
        toast.success(data.message)
        setUnsavedChanges(prev => ({
          ...prev,
          [activeTab]: false
        }))
        setSettings(data.settings)
      } else {
        toast.error(data.message || "Failed to save settings")
      }
    } catch (error) {
      toast.error("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  const resetSettings = async (category) => {
    try {
      setSaving(true)
      
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reset",
          category: category
        }),
      })

      const data = await res.json()
      
      if (data.success) {
        toast.success(data.message)
        setSettings(data.settings)
        setUnsavedChanges({})
        setShowConfirmReset(null)
      } else {
        toast.error(data.message || "Failed to reset settings")
      }
    } catch (error) {
      toast.error("Error resetting settings")
    } finally {
      setSaving(false)
    }
  }

  const exportSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/export')
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lemufex-settings-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Settings exported successfully!')
      } else {
        toast.error('Failed to export settings')
      }
    } catch (error) {
      toast.error('Error exporting settings')
    }
  }

  const handleImportFile = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/json') {
      setImportFile(file)
    } else {
      toast.error('Please select a valid JSON file')
      event.target.value = ''
    }
  }

  const importSettings = async (overwrite = false) => {
    if (!importFile) {
      toast.error('Please select a file to import')
      return
    }

    try {
      setImporting(true)
      
      const fileContent = await importFile.text()
      const importData = JSON.parse(fileContent)
      
      if (!importData.settings) {
        toast.error('Invalid settings file format')
        return
      }

      const response = await fetch('/api/admin/settings/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: importData.settings,
          overwrite
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(`Settings imported successfully! Updated ${data.details.updatedFields} fields.`)
        setSettings(data.settings)
        setUnsavedChanges({})
        setShowImportModal(false)
        setImportFile(null)
      } else {
        toast.error(data.message || 'Failed to import settings')
      }
    } catch (error) {
      toast.error('Error importing settings. Please check the file format.')
    } finally {
      setImporting(false)
    }
  }

  if (status === "loading" || loading) {
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

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiSettings className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">Failed to load settings</p>
        </div>
      </div>
    )
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.siteName || ""}
            onChange={(e) => handleInputChange("siteName", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.contactEmail || ""}
            onChange={(e) => handleInputChange("contactEmail", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.siteDescription || ""}
          onChange={(e) => handleInputChange("siteDescription", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Email
          </label>
          <input
            type="email"
            value={settings.supportEmail || ""}
            onChange={(e) => handleInputChange("supportEmail", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={settings.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          value={settings.address || ""}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
        />
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["facebook", "twitter", "linkedin", "instagram", "youtube"].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {platform}
              </label>
              <input
                type="url"
                value={settings.socialMedia?.[platform] || ""}
                onChange={(e) => handleInputChange("socialMedia", {
                  ...settings.socialMedia,
                  [platform]: e.target.value
                })}
                placeholder={`https://${platform}.com/yourpage`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800 mb-2">
          <FiAlertTriangle size={20} />
          <h4 className="font-semibold">System Controls</h4>
        </div>
        <p className="text-sm text-yellow-700">
          These settings affect the entire system. Use with caution.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
            <p className="text-sm text-gray-600">Temporarily disable the site for maintenance</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode || false}
              onChange={(e) => handleInputChange("maintenanceMode", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Allow Registration</h4>
            <p className="text-sm text-gray-600">Allow new users to register</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowRegistration || false}
              onChange={(e) => handleInputChange("allowRegistration", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Verification Required</h4>
            <p className="text-sm text-gray-600">Require email verification for new accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requireEmailVerification || false}
              onChange={(e) => handleInputChange("requireEmailVerification", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max File Upload Size (MB)
        </label>
        <input
          type="number"
          value={Math.round((settings.maxFileUploadSize || 10485760) / 1048576)}
          onChange={(e) => handleInputChange("maxFileUploadSize", parseInt(e.target.value) * 1048576)}
          min="1"
          max="100"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Current: {Math.round((settings.maxFileUploadSize || 10485760) / 1048576)} MB
        </p>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800 mb-2">
          <FiShield size={20} />
          <h4 className="font-semibold">Security Settings</h4>
        </div>
        <p className="text-sm text-red-700">
          These settings control authentication and security policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (hours)
          </label>
          <input
            type="number"
            value={Math.round((settings.sessionTimeout || 604800000) / 3600000)}
            onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value) * 3600000)}
            min="1"
            max="168"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={settings.maxLoginAttempts || 5}
            onChange={(e) => handleInputChange("maxLoginAttempts", parseInt(e.target.value))}
            min="3"
            max="10"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Password Length
          </label>
          <input
            type="number"
            value={settings.passwordMinLength || 6}
            onChange={(e) => handleInputChange("passwordMinLength", parseInt(e.target.value))}
            min="6"
            max="20"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Require Strong Passwords</h4>
            <p className="text-sm text-gray-600">Enforce uppercase, lowercase, numbers, and symbols</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requireStrongPassword || false}
              onChange={(e) => handleInputChange("requireStrongPassword", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Enable 2FA for admin accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactorAuth || false}
              onChange={(e) => handleInputChange("twoFactorAuth", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Gateway
          </label>
          <select
            value={settings.paymentGateway || "paystack"}
            onChange={(e) => handleInputChange("paymentGateway", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          >
            <option value="paystack">Paystack</option>
            <option value="stripe">Stripe</option>
            <option value="flutterwave">Flutterwave</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={settings.currency || "NGN"}
            onChange={(e) => handleInputChange("currency", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          >
            <option value="NGN">Nigerian Naira (NGN)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tax Rate (%)
        </label>
        <input
          type="number"
          value={settings.taxRate || 0}
          onChange={(e) => handleInputChange("taxRate", parseFloat(e.target.value))}
          min="0"
          max="100"
          step="0.1"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
        />
      </div>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Provider
          </label>
          <select
            value={settings.emailProvider || "resend"}
            onChange={(e) => handleInputChange("emailProvider", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          >
            <option value="resend">Resend</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Name
          </label>
          <input
            type="text"
            value={settings.emailFromName || ""}
            onChange={(e) => handleInputChange("emailFromName", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From Email Address
        </label>
        <input
          type="email"
          value={settings.emailFromAddress || ""}
          onChange={(e) => handleInputChange("emailFromAddress", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
        />
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Send notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableEmailNotifications || false}
              onChange={(e) => handleInputChange("enableEmailNotifications", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Send notifications via SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableSMSNotifications || false}
              onChange={(e) => handleInputChange("enableSMSNotifications", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-600">Send browser push notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enablePushNotifications || false}
              onChange={(e) => handleInputChange("enablePushNotifications", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Notify Admin on New User</h4>
            <p className="text-sm text-gray-600">Get notified when new users register</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifyAdminOnNewUser || false}
              onChange={(e) => handleInputChange("notifyAdminOnNewUser", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Notify Admin on New Payment</h4>
            <p className="text-sm text-gray-600">Get notified when payments are received</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifyAdminOnNewPayment || false}
              onChange={(e) => handleInputChange("notifyAdminOnNewPayment", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderTrainingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Training Duration (weeks)
          </label>
          <input
            type="number"
            value={settings.defaultTrainingDuration || 12}
            onChange={(e) => handleInputChange("defaultTrainingDuration", parseInt(e.target.value))}
            min="1"
            max="52"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Trainees Per Batch
          </label>
          <input
            type="number"
            value={settings.maxTraineesPerBatch || 20}
            onChange={(e) => handleInputChange("maxTraineesPerBatch", parseInt(e.target.value))}
            min="1"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Allow Self Enrollment</h4>
            <p className="text-sm text-gray-600">Let users enroll in courses themselves</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowSelfEnrollment || false}
              onChange={(e) => handleInputChange("allowSelfEnrollment", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Require Payment Before Access</h4>
            <p className="text-sm text-gray-600">Users must pay before accessing course materials</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requirePaymentBeforeAccess || false}
              onChange={(e) => handleInputChange("requirePaymentBeforeAccess", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderChatSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">Enable Live Chat</h4>
          <p className="text-sm text-gray-600">Allow users to chat with support</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enableLiveChat || false}
            onChange={(e) => handleInputChange("enableLiveChat", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Offline Message
        </label>
        <textarea
          value={settings.chatOfflineMessage || ""}
          onChange={(e) => handleInputChange("chatOfflineMessage", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          placeholder="Message shown when chat is offline"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Chat History
        </label>
        <input
          type="number"
          value={settings.maxChatHistory || 100}
          onChange={(e) => handleInputChange("maxChatHistory", parseInt(e.target.value))}
          min="10"
          max="1000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
        />
      </div>
    </div>
  )

  const renderAnalyticsSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">Enable Analytics</h4>
          <p className="text-sm text-gray-600">Track user behavior and site performance</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enableAnalytics || false}
            onChange={(e) => handleInputChange("enableAnalytics", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FE9900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE9900]"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={settings.googleAnalyticsId || ""}
            onChange={(e) => handleInputChange("googleAnalyticsId", e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facebook Pixel ID
          </label>
          <input
            type="text"
            value={settings.facebookPixelId || ""}
            onChange={(e) => handleInputChange("facebookPixelId", e.target.value)}
            placeholder="123456789012345"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return renderGeneralSettings()
      case "system": return renderSystemSettings()
      case "security": return renderSecuritySettings()
      case "payment": return renderPaymentSettings()
      case "email": return renderEmailSettings()
      case "notifications": return renderNotificationSettings()
      case "training": return renderTrainingSettings()
      case "chat": return renderChatSettings()
      case "analytics": return renderAnalyticsSettings()
      default: return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#FE9900] rounded-lg">
            <FiSettings className="text-white" size={20} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Settings</h1>
        </div>
        <p className="text-gray-600">Configure and manage your application settings</p>
      </div>

      <div className="space-y-6">
        {/* Tab Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Settings Category
              </label>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent font-medium"
              >
                {tabs.map((tab) => {
                  const hasUnsavedChanges = unsavedChanges[tab.id]
                  return (
                    <option key={tab.id} value={tab.id}>
                      {tab.label} {hasUnsavedChanges ? '(*)' : ''}
                    </option>
                  )
                })}
              </select>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-end gap-2">
              <button
                onClick={exportSettings}
                className="flex items-center gap-2 px-4 py-3 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200 border border-green-200"
              >
                <FiDownload size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-blue-200"
              >
                <FiUpload size={16} />
                <span className="hidden sm:inline">Import</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Tab Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {(() => {
                  const ActiveIcon = tabs.find(tab => tab.id === activeTab)?.icon || FiSettings
                  return <ActiveIcon className="text-[#FE9900]" size={20} />
                })()}
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {activeTab} Settings
                </h2>
                {unsavedChanges[activeTab] && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-800 bg-amber-100 rounded-full">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                    Unsaved changes
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConfirmReset(activeTab)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiRefreshCw size={16} />
                  Reset Category
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {renderTabContent()}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="text-sm text-gray-500 text-center sm:text-left">
                {settings.lastUpdatedBy ? (
                  <span>Last updated by admin</span>
                ) : (
                  <span>Configure your system settings</span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowConfirmReset("all")}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full sm:w-auto border border-red-200"
                >
                  <FiRefreshCw size={16} />
                  Reset All Settings
                </button>
                
                <button
                  onClick={saveSettings}
                  disabled={saving || !unsavedChanges[activeTab]}
                  className="flex items-center justify-center gap-2 bg-[#FE9900] hover:bg-[#E5890A] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      Save {(() => {
                        const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || 'Settings'
                        return activeTabLabel
                      })()} Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiUpload className="text-blue-600" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Import Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Settings File
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only JSON files exported from this system are supported.
                  </p>
                </div>
                
                {importFile && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FiFileText size={16} />
                      <span className="text-sm font-medium">{importFile.name}</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Size: {(importFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportFile(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => importSettings(false)}
                  disabled={!importFile || importing}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  {importing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiUpload size={16} />
                  )}
                  Import
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> This will only update empty or undefined settings. To overwrite existing values, use the "Force Import" option.
                </p>
                <button
                  onClick={() => importSettings(true)}
                  disabled={!importFile || importing}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  {importing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiAlertTriangle size={14} />
                  )}
                  Force Import (Overwrite)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiAlertTriangle className="text-red-600" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Reset</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to reset {showConfirmReset === "all" ? "all settings" : `${showConfirmReset} settings`} to default values? This action cannot be undone.
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowConfirmReset(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => resetSettings(showConfirmReset)}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiCheck size={16} />
                  )}
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
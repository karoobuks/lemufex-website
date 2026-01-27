import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    // General Settings
    siteName: {
      type: String,
      default: "Lemufex Engineering",
      required: true,
    },
    siteDescription: {
      type: String,
      default: "Professional Engineering Training & Services",
    },
    contactEmail: {
      type: String,
      default: "info@lemufex.com",
      required: true,
    },
    supportEmail: {
      type: String,
      default: "support@lemufex.com",
    },
    phone: {
      type: String,
      default: "+234-XXX-XXX-XXXX",
    },
    address: {
      type: String,
      default: "Lagos, Nigeria",
    },

    // System Settings
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowRegistration: {
      type: Boolean,
      default: true,
    },
    requireEmailVerification: {
      type: Boolean,
      default: false,
    },
    maxFileUploadSize: {
      type: Number,
      default: 10485760, // 10MB in bytes
    },

    // Payment Settings
    paymentGateway: {
      type: String,
      enum: ["paystack", "stripe", "flutterwave"],
      default: "paystack",
    },
    currency: {
      type: String,
      default: "NGN",
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Email Settings
    emailProvider: {
      type: String,
      enum: ["resend", "sendgrid", "mailgun"],
      default: "resend",
    },
    emailFromName: {
      type: String,
      default: "Lemufex Engineering",
    },
    emailFromAddress: {
      type: String,
      default: "noreply@lemufex.com",
    },

    // Security Settings
    sessionTimeout: {
      type: Number,
      default: 604800000, // 7 days in milliseconds
    },
    maxLoginAttempts: {
      type: Number,
      default: 5,
    },
    passwordMinLength: {
      type: Number,
      default: 6,
      min: 6,
    },
    requireStrongPassword: {
      type: Boolean,
      default: false,
    },
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },

    // Notification Settings
    enableEmailNotifications: {
      type: Boolean,
      default: true,
    },
    enableSMSNotifications: {
      type: Boolean,
      default: false,
    },
    enablePushNotifications: {
      type: Boolean,
      default: true,
    },
    notifyAdminOnNewUser: {
      type: Boolean,
      default: true,
    },
    notifyAdminOnNewPayment: {
      type: Boolean,
      default: true,
    },

    // Training Settings
    defaultTrainingDuration: {
      type: Number,
      default: 12, // weeks
    },
    maxTraineesPerBatch: {
      type: Number,
      default: 20,
    },
    allowSelfEnrollment: {
      type: Boolean,
      default: true,
    },
    requirePaymentBeforeAccess: {
      type: Boolean,
      default: true,
    },

    // Chat Settings
    enableLiveChat: {
      type: Boolean,
      default: true,
    },
    chatOfflineMessage: {
      type: String,
      default: "We're currently offline. Please leave a message and we'll get back to you.",
    },
    maxChatHistory: {
      type: Number,
      default: 100,
    },

    // Social Media Links
    socialMedia: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
      youtube: String,
    },

    // SEO Settings
    metaTitle: {
      type: String,
      default: "Lemufex Engineering - Professional Training & Services",
    },
    metaDescription: {
      type: String,
      default: "Leading provider of engineering training and professional services in automation, electrical engineering, and software development.",
    },
    metaKeywords: {
      type: String,
      default: "engineering training, automation, electrical engineering, software development, professional services",
    },

    // Backup Settings
    autoBackup: {
      type: Boolean,
      default: true,
    },
    backupFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "weekly",
    },
    backupRetentionDays: {
      type: Number,
      default: 30,
    },

    // Analytics Settings
    googleAnalyticsId: String,
    facebookPixelId: String,
    enableAnalytics: {
      type: Boolean,
      default: true,
    },

    // Rate Limiting
    rateLimitWindow: {
      type: Number,
      default: 60000, // 1 minute
    },
    rateLimitMaxRequests: {
      type: Number,
      default: 100,
    },

    // Last updated info
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "settings",
  }
);

// Ensure only one settings document exists
SettingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Settings from "@/models/Settings";

// GET - Export settings as JSON
export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.getInstance();
    
    // Create export data with metadata
    const exportData = {
      exportedAt: new Date().toISOString(),
      exportedBy: "admin",
      version: "1.0",
      settings: {
        // General Settings
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        supportEmail: settings.supportEmail,
        phone: settings.phone,
        address: settings.address,
        
        // System Settings
        maintenanceMode: settings.maintenanceMode,
        allowRegistration: settings.allowRegistration,
        requireEmailVerification: settings.requireEmailVerification,
        maxFileUploadSize: settings.maxFileUploadSize,
        
        // Payment Settings
        paymentGateway: settings.paymentGateway,
        currency: settings.currency,
        taxRate: settings.taxRate,
        
        // Email Settings
        emailProvider: settings.emailProvider,
        emailFromName: settings.emailFromName,
        emailFromAddress: settings.emailFromAddress,
        
        // Security Settings
        sessionTimeout: settings.sessionTimeout,
        maxLoginAttempts: settings.maxLoginAttempts,
        passwordMinLength: settings.passwordMinLength,
        requireStrongPassword: settings.requireStrongPassword,
        twoFactorAuth: settings.twoFactorAuth,
        
        // Notification Settings
        enableEmailNotifications: settings.enableEmailNotifications,
        enableSMSNotifications: settings.enableSMSNotifications,
        enablePushNotifications: settings.enablePushNotifications,
        notifyAdminOnNewUser: settings.notifyAdminOnNewUser,
        notifyAdminOnNewPayment: settings.notifyAdminOnNewPayment,
        
        // Training Settings
        defaultTrainingDuration: settings.defaultTrainingDuration,
        maxTraineesPerBatch: settings.maxTraineesPerBatch,
        allowSelfEnrollment: settings.allowSelfEnrollment,
        requirePaymentBeforeAccess: settings.requirePaymentBeforeAccess,
        
        // Chat Settings
        enableLiveChat: settings.enableLiveChat,
        chatOfflineMessage: settings.chatOfflineMessage,
        maxChatHistory: settings.maxChatHistory,
        
        // Social Media
        socialMedia: settings.socialMedia,
        
        // SEO Settings
        metaTitle: settings.metaTitle,
        metaDescription: settings.metaDescription,
        metaKeywords: settings.metaKeywords,
        
        // Analytics
        googleAnalyticsId: settings.googleAnalyticsId,
        facebookPixelId: settings.facebookPixelId,
        enableAnalytics: settings.enableAnalytics,
      }
    };

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', `attachment; filename="lemufex-settings-${new Date().toISOString().split('T')[0]}.json"`);

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error("Settings export error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to export settings" },
      { status: 500 }
    );
  }
}
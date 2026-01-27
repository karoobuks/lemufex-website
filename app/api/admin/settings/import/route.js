import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Settings from "@/models/Settings";

// POST - Import settings from JSON
export async function POST(request) {
  try {
    const body = await request.json();
    const { settings: importedSettings, overwrite = false } = body;

    if (!importedSettings) {
      return NextResponse.json(
        { success: false, message: "No settings data provided" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Get current settings
    let settings = await Settings.getInstance();
    
    // Validate imported settings structure
    const validFields = [
      'siteName', 'siteDescription', 'contactEmail', 'supportEmail', 'phone', 'address',
      'maintenanceMode', 'allowRegistration', 'requireEmailVerification', 'maxFileUploadSize',
      'paymentGateway', 'currency', 'taxRate',
      'emailProvider', 'emailFromName', 'emailFromAddress',
      'sessionTimeout', 'maxLoginAttempts', 'passwordMinLength', 'requireStrongPassword', 'twoFactorAuth',
      'enableEmailNotifications', 'enableSMSNotifications', 'enablePushNotifications', 'notifyAdminOnNewUser', 'notifyAdminOnNewPayment',
      'defaultTrainingDuration', 'maxTraineesPerBatch', 'allowSelfEnrollment', 'requirePaymentBeforeAccess',
      'enableLiveChat', 'chatOfflineMessage', 'maxChatHistory',
      'socialMedia', 'metaTitle', 'metaDescription', 'metaKeywords',
      'googleAnalyticsId', 'facebookPixelId', 'enableAnalytics'
    ];

    let updatedFields = [];
    let skippedFields = [];

    // Update settings with imported data
    Object.keys(importedSettings).forEach(key => {
      if (validFields.includes(key)) {
        if (overwrite || settings[key] === undefined || settings[key] === null) {
          settings[key] = importedSettings[key];
          updatedFields.push(key);
        } else {
          skippedFields.push(key);
        }
      }
    });

    // Set last updated by
    settings.lastUpdatedBy = null;
    
    await settings.save();

    return NextResponse.json({
      success: true,
      message: "Settings imported successfully",
      details: {
        updatedFields: updatedFields.length,
        skippedFields: skippedFields.length,
        totalFields: Object.keys(importedSettings).length
      },
      settings,
    });

  } catch (error) {
    console.error("Settings import error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to import settings" },
      { status: 500 }
    );
  }
}
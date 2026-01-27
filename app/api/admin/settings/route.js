import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Settings from "@/models/Settings";

// GET - Fetch current settings
export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.getInstance();
    
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request) {
  try {
    const body = await request.json();
    const { category, settings: settingsData } = body;

    if (!category || !settingsData) {
      return NextResponse.json(
        { success: false, message: "Category and settings data are required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Get current settings
    let settings = await Settings.getInstance();
    
    // Update only the provided fields
    Object.keys(settingsData).forEach(key => {
      if (settingsData[key] !== undefined) {
        settings[key] = settingsData[key];
      }
    });
    
    await settings.save();

    return NextResponse.json({
      success: true,
      message: `${category} settings updated successfully`,
      settings,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    );
  }
}

// POST - Reset settings to default
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, category } = body;

    if (action !== "reset") {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    await connectDB();
    
    if (category === "all") {
      // Reset all settings
      await Settings.deleteMany({});
      const newSettings = await Settings.create({});
      
      return NextResponse.json({
        success: true,
        message: "All settings reset to default",
        settings: newSettings,
      });
    } else {
      // Reset specific category (implement category-specific reset logic)
      const settings = await Settings.getInstance();
      
      // Define default values for each category
      const defaults = {
        general: {
          siteName: "Lemufex Engineering",
          siteDescription: "Professional Engineering Training & Services",
          contactEmail: "info@lemufex.com",
          supportEmail: "support@lemufex.com",
          phone: "+234-XXX-XXX-XXXX",
          address: "Lagos, Nigeria",
        },
        system: {
          maintenanceMode: false,
          allowRegistration: true,
          requireEmailVerification: false,
          maxFileUploadSize: 10485760,
        },
        payment: {
          paymentGateway: "paystack",
          currency: "NGN",
          taxRate: 0,
        },
        email: {
          emailProvider: "resend",
          emailFromName: "Lemufex Engineering",
          emailFromAddress: "noreply@lemufex.com",
        },
        security: {
          sessionTimeout: 604800000,
          maxLoginAttempts: 5,
          passwordMinLength: 6,
          requireStrongPassword: false,
          twoFactorAuth: false,
        },
        notifications: {
          enableEmailNotifications: true,
          enableSMSNotifications: false,
          enablePushNotifications: true,
          notifyAdminOnNewUser: true,
          notifyAdminOnNewPayment: true,
        },
        training: {
          defaultTrainingDuration: 12,
          maxTraineesPerBatch: 20,
          allowSelfEnrollment: true,
          requirePaymentBeforeAccess: true,
        },
        chat: {
          enableLiveChat: true,
          chatOfflineMessage: "We're currently offline. Please leave a message and we'll get back to you.",
          maxChatHistory: 100,
        },
      };

      if (defaults[category]) {
        Object.keys(defaults[category]).forEach(key => {
          settings[key] = defaults[category][key];
        });
        
        await settings.save();
        
        return NextResponse.json({
          success: true,
          message: `${category} settings reset to default`,
          settings,
        });
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid category" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Settings reset error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset settings" },
      { status: 500 }
    );
  }
}
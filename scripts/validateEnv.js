// Environment validation for production deployment
const requiredEnvVars = {
  // Critical for app to function
  MONGODB_URI: 'Database connection string',
  NEXTAUTH_SECRET: 'NextAuth secret (min 32 chars)',
  JWT_SECRET: 'JWT secret (min 32 chars)',
  PAYSTACK_SECRET_KEY: 'Paystack secret key',
  PAYSTACK_PUBLIC_KEY: 'Paystack public key',
  
  // Important for production
  APP_URL: 'Application URL',
  NEXTAUTH_URL: 'NextAuth URL',
  FROM_EMAIL: 'From email address',
  
  // Recommended for scaling
  REDIS_URL: 'Redis connection (recommended)',
  CLOUDINARY_CLOUD_NAME: 'Cloudinary cloud name',
  RESEND_API_KEY: 'Email service API key'
};

const optionalEnvVars = {
  GOOGLE_CLIENT_ID: 'Google OAuth (optional)',
  SENTRY_DSN: 'Error tracking (recommended)',
  GOOGLE_ANALYTICS_ID: 'Analytics (recommended)',
  CDN_URL: 'CDN for static assets (recommended)'
};

function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n');
  
  const missing = [];
  const warnings = [];
  
  // Check required variables
  Object.entries(requiredEnvVars).forEach(([key, description]) => {
    const value = process.env[key];
    if (!value || value.includes('your-') || value.includes('localhost')) {
      missing.push(`❌ ${key}: ${description}`);
    } else {
      console.log(`✅ ${key}: Set`);
    }
  });
  
  // Check optional but recommended variables
  Object.entries(optionalEnvVars).forEach(([key, description]) => {
    const value = process.env[key];
    if (!value || value.includes('your-')) {
      warnings.push(`⚠️  ${key}: ${description}`);
    } else {
      console.log(`✅ ${key}: Set`);
    }
  });
  
  // Security checks
  console.log('\n🔒 Security validation:');
  
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    missing.push('❌ NEXTAUTH_SECRET: Must be at least 32 characters');
  }
  
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    missing.push('❌ JWT_SECRET: Must be at least 32 characters');
  }
  
  if (process.env.NODE_ENV !== 'production') {
    warnings.push('⚠️  NODE_ENV: Should be "production" for deployment');
  }
  
  // Results
  console.log('\n📊 Validation Results:');
  
  if (missing.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES (must fix):');
    missing.forEach(issue => console.log(issue));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (recommended):');
    warnings.forEach(warning => console.log(warning));
  }
  
  if (missing.length === 0) {
    console.log('\n🎉 Environment validation passed!');
    console.log('✅ Your app is ready for production deployment');
  } else {
    console.log(`\n❌ Found ${missing.length} critical issues`);
    console.log('🔧 Please fix these before deploying to production');
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config();
validateEnvironment();
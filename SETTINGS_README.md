# Admin Settings System

A comprehensive, world-class admin settings system for the Lemufex Engineering platform with full CRUD functionality, import/export capabilities, and deployment-ready features.

## 🚀 Features

### Core Functionality
- **Tabbed Interface**: Organized settings into 9 logical categories
- **Real-time Updates**: Instant saving with visual feedback
- **Import/Export**: Backup and restore settings as JSON files
- **Reset Functionality**: Reset individual categories or all settings
- **Validation**: Comprehensive input validation and error handling
- **Responsive Design**: Mobile-first design that works on all devices

### Settings Categories

#### 1. General Settings
- Site name and description
- Contact information (email, phone, address)
- Social media links (Facebook, Twitter, LinkedIn, Instagram, YouTube)

#### 2. System Settings
- Maintenance mode toggle
- User registration controls
- Email verification requirements
- File upload size limits

#### 3. Security Settings
- Session timeout configuration
- Login attempt limits
- Password requirements
- Two-factor authentication toggle

#### 4. Payment Settings
- Payment gateway selection (Paystack, Stripe, Flutterwave)
- Currency configuration
- Tax rate settings

#### 5. Email Settings
- Email provider selection (Resend, SendGrid, Mailgun)
- From name and address configuration

#### 6. Notification Settings
- Email, SMS, and push notification toggles
- Admin notification preferences

#### 7. Training Settings
- Default training duration
- Maximum trainees per batch
- Enrollment and payment policies

#### 8. Chat Settings
- Live chat toggle
- Offline message configuration
- Chat history limits

#### 9. Analytics Settings
- Google Analytics integration
- Facebook Pixel configuration
- Analytics toggle

## 📁 File Structure

```
app/
├── admin/
│   └── settings/
│       └── page.jsx                 # Main settings page
├── api/
│   └── admin/
│       └── settings/
│           ├── route.js             # Main CRUD operations
│           ├── export/
│           │   └── route.js         # Export functionality
│           └── import/
│               └── route.js         # Import functionality
models/
└── Settings.js                     # Database model
scripts/
└── initializeSettings.js           # Database initialization
```

## 🛠️ Installation & Setup

### 1. Initialize Settings in Database

Run the initialization script to create default settings:

```bash
node scripts/initializeSettings.js
```

### 2. Environment Variables

Ensure these environment variables are set in your `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

### 3. Access the Settings

Navigate to `/admin/settings` in your application (admin role required).

## 🔧 API Endpoints

### GET /api/admin/settings
Fetch current settings

**Response:**
```json
{
  "success": true,
  "settings": { ... }
}
```

### PUT /api/admin/settings
Update settings

**Request Body:**
```json
{
  "category": "general",
  "settings": {
    "siteName": "New Site Name",
    "contactEmail": "new@email.com"
  }
}
```

### POST /api/admin/settings
Reset settings to default

**Request Body:**
```json
{
  "action": "reset",
  "category": "general" // or "all"
}
```

### GET /api/admin/settings/export
Export settings as JSON file

**Response:** Downloads a JSON file with all settings

### POST /api/admin/settings/import
Import settings from JSON file

**Request Body:**
```json
{
  "settings": { ... },
  "overwrite": false
}
```

## 💾 Database Schema

The settings are stored in a single MongoDB document with the following structure:

```javascript
{
  // General Settings
  siteName: String,
  siteDescription: String,
  contactEmail: String,
  supportEmail: String,
  phone: String,
  address: String,
  
  // System Settings
  maintenanceMode: Boolean,
  allowRegistration: Boolean,
  requireEmailVerification: Boolean,
  maxFileUploadSize: Number,
  
  // Security Settings
  sessionTimeout: Number,
  maxLoginAttempts: Number,
  passwordMinLength: Number,
  requireStrongPassword: Boolean,
  twoFactorAuth: Boolean,
  
  // ... and more categories
  
  // Metadata
  lastUpdatedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI/UX Features

### Visual Indicators
- **Unsaved Changes**: Red dots indicate unsaved changes per tab
- **Loading States**: Spinners and disabled states during operations
- **Success/Error Messages**: Toast notifications for all operations
- **Confirmation Dialogs**: Prevent accidental resets

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Collapsible Sidebar**: Space-efficient navigation
- **Touch-Friendly**: Large touch targets and proper spacing

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML
- **High Contrast**: Clear visual hierarchy and contrast ratios

## 🔒 Security Features

### Authentication & Authorization
- **Admin Only**: Restricted to users with admin role
- **Session Validation**: Server-side session verification
- **CSRF Protection**: Built-in Next.js CSRF protection

### Data Validation
- **Input Sanitization**: All inputs are validated and sanitized
- **Type Checking**: Strict type validation for all settings
- **Range Validation**: Numeric inputs have min/max constraints

### Audit Trail
- **Change Tracking**: Records who made the last update
- **Timestamps**: Automatic creation and update timestamps

## 🚀 Deployment Considerations

### Production Checklist
- [ ] Environment variables configured
- [ ] Database initialized with default settings
- [ ] Admin user created
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting configured
- [ ] Backup strategy in place

### Performance Optimizations
- **Single Document**: All settings in one document for fast retrieval
- **Caching**: Consider implementing Redis caching for frequently accessed settings
- **Indexing**: Database indexes on frequently queried fields

### Monitoring
- **Error Logging**: All errors are logged with context
- **Performance Metrics**: Track API response times
- **Usage Analytics**: Monitor which settings are changed most frequently

## 🔄 Backup & Recovery

### Automatic Backups
The system includes settings for automatic backups:
- **Frequency**: Daily, weekly, or monthly
- **Retention**: Configurable retention period
- **Format**: JSON exports for easy restoration

### Manual Backup
Use the export functionality to create manual backups:
1. Navigate to Settings page
2. Click "Export" button
3. Save the downloaded JSON file securely

### Recovery Process
To restore from backup:
1. Navigate to Settings page
2. Click "Import" button
3. Select your backup JSON file
4. Choose import mode (merge or overwrite)

## 🧪 Testing

### Unit Tests
```bash
# Run settings API tests
npm test -- --testPathPattern=settings

# Run settings component tests
npm test -- --testPathPattern=SettingsPage
```

### Integration Tests
```bash
# Test full settings workflow
npm run test:integration -- settings
```

### Manual Testing Checklist
- [ ] All tabs load correctly
- [ ] Settings save and persist
- [ ] Export downloads valid JSON
- [ ] Import restores settings correctly
- [ ] Reset functionality works
- [ ] Validation prevents invalid inputs
- [ ] Mobile responsiveness works
- [ ] Error handling displays appropriate messages

## 🤝 Contributing

### Adding New Settings
1. Update the `Settings.js` model
2. Add the field to the settings page UI
3. Update the export/import functionality
4. Add validation rules
5. Update this documentation

### Code Style
- Use TypeScript for new components
- Follow existing naming conventions
- Add proper error handling
- Include loading states
- Write comprehensive tests

## 📞 Support

For issues or questions regarding the settings system:
1. Check the error logs in `/logs/`
2. Verify database connectivity
3. Ensure proper environment variables
4. Check user permissions

## 🔮 Future Enhancements

### Planned Features
- [ ] Settings versioning and rollback
- [ ] Bulk operations for multiple settings
- [ ] Settings templates for different environments
- [ ] Real-time collaboration for multiple admins
- [ ] Advanced validation rules engine
- [ ] Settings dependency management
- [ ] API rate limiting per setting category
- [ ] Settings change notifications
- [ ] Integration with external configuration services

### Performance Improvements
- [ ] Redis caching layer
- [ ] Settings preloading
- [ ] Optimistic updates
- [ ] Background sync for large imports

---

**Built with ❤️ for Lemufex Engineering**

*This settings system is designed to be production-ready, scalable, and maintainable. It follows industry best practices for security, performance, and user experience.*
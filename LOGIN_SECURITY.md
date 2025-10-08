# 🔒 Login Attempt Protection System

A comprehensive brute force attack prevention system that tracks failed login attempts and implements temporary account lockouts.

## ✨ Features

### 🛡️ Security Features
- **Maximum 3 failed attempts** before lockout
- **15-minute lockout duration** after max attempts reached
- **Email-based tracking** - lockouts are per email address
- **Automatic cleanup** of expired lockouts
- **Local storage persistence** - survives browser refresh

### 📱 User Experience
- **Real-time lockout status** display
- **Countdown timer** showing remaining lockout time
- **Attempt warnings** showing remaining attempts
- **Form disabling** during lockout periods
- **Clear error messages** with helpful information

### 🔧 Admin Features
- **Testing utilities** for development
- **Admin console tools** for debugging
- **Lockout management** functions
- **Attempt simulation** for testing

## 🚀 How It Works

### 1. Failed Attempt Tracking
```javascript
// When login fails
const status = recordFailedAttempt(email)
// Returns: { isLocked: false, attemptsLeft: 2, remainingTime: 0 }
```

### 2. Lockout Activation
After 3 failed attempts:
```javascript
// Account gets locked for 15 minutes
const status = checkLockoutStatus(email)
// Returns: { isLocked: true, attemptsLeft: 0, remainingTime: 900000 }
```

### 3. Successful Login Reset
```javascript
// Clears all attempts for the email
recordSuccessfulLogin(email)
```

## 🧪 Testing the System

### Browser Console Testing
Open your browser's developer console and use these commands:

```javascript
// Test complete lockout flow
window.loginAttemptsAdmin.testLockoutFlow('test@example.com')

// Simulate specific number of failed attempts
window.loginAttemptsAdmin.simulateFailedAttempts('user@example.com', 2)

// Check status of an email
window.loginAttemptsAdmin.checkEmailStatus('user@example.com')

// View all stored attempts
window.loginAttemptsAdmin.viewAllAttempts()

// Clear all attempts (admin function)
window.loginAttemptsAdmin.clearAllLoginAttempts()
```

### Manual Testing Steps
1. **Go to the login page**
2. **Enter a valid email** (any format)
3. **Enter wrong password** and submit
4. **Repeat 2 more times** - you should see:
   - Attempt 1: "2 attempts remaining"
   - Attempt 2: "1 attempt remaining"
   - Attempt 3: Account locked for 15 minutes
5. **Verify lockout behavior**:
   - Form fields disabled
   - Submit button shows "Account Locked"
   - Countdown timer displayed
   - Warning banner shown

## 📁 File Structure

```
src/utils/
├── loginAttempts.js          # Core tracking system
└── loginAttemptsAdmin.js     # Testing and admin utilities

src/components/auth/
└── LoginForm.vue             # Updated with lockout UI
```

## ⚙️ Configuration

Edit `src/utils/loginAttempts.js` to modify settings:

```javascript
const MAX_ATTEMPTS = 3                      // Failed attempts before lockout
const LOCKOUT_DURATION = 15 * 60 * 1000    // 15 minutes in milliseconds
const STORAGE_KEY = 'login_attempts'        // localStorage key
```

## 🔒 Security Benefits

### ✅ Prevents Brute Force Attacks
- Limits rapid password guessing
- Forces attackers to wait between attempts
- Makes password cracking impractical

### ✅ Rate Limiting
- Controls login attempt frequency
- Reduces server load from attack attempts
- Protects against automated attacks

### ✅ User-Friendly Security
- Clear feedback to legitimate users
- No permanent account lockout
- Automatic recovery after timeout

## 📊 UI Components

### Warning Banners
- **Red Alert**: Account locked with countdown
- **Yellow Alert**: Attempts remaining warning
- **Info Text**: Security information display

### Form States
- **Disabled Fields**: During lockout period
- **Disabled Button**: Shows "Account Locked"
- **Loading State**: During login processing

### Real-time Updates
- **Countdown Timer**: Updates every second
- **Status Checks**: On email field changes
- **Automatic Unlocking**: When timer expires

## 🛠️ Development Notes

### localStorage Data Structure
```javascript
{
  "user@example.com": {
    "attempts": 2,
    "firstAttempt": 1640995200000,
    "lastAttempt": 1640995300000,
    "lockedUntil": 1640996100000  // Only present when locked
  }
}
```

### Production Considerations
- Remove admin tools in production build
- Consider server-side tracking for enhanced security
- Monitor localStorage usage
- Add logging for security events

## 🎯 Future Enhancements

- [ ] Progressive lockout (increasing timeouts)
- [ ] IP-based tracking
- [ ] Email notifications for lockouts
- [ ] Admin dashboard for monitoring
- [ ] Captcha integration after attempts
- [ ] Server-side attempt tracking

## 🐛 Troubleshooting

### Lockout Not Working?
1. Check browser console for errors
2. Verify localStorage is enabled
3. Test with admin utilities
4. Check email format consistency

### Timer Not Updating?
1. Ensure component lifecycle is correct
2. Check for memory leaks in intervals
3. Verify countdown function calls

### Form Still Enabled During Lockout?
1. Check `isFormDisabled` computed property
2. Verify `lockoutStatus.isLocked` state
3. Test `checkLockoutStatus` function

---

**🔐 Security First**: This system provides a good baseline protection against brute force attacks while maintaining user experience. For production applications, consider implementing additional server-side protections.
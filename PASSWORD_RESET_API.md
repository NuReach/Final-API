# Password Reset API Documentation

This API provides three password-related endpoints for managing user passwords.

## Prerequisites

Make sure you have the `FRONTEND_URL` environment variable set in your `.env` file:

```env
FRONTEND_URL=http://localhost:5173
```

This is used for the password reset redirect URL.

---

## API Endpoints

### 1. Request Password Reset

**POST** `/api/auth/request-password-reset`

Sends a password reset email to the user's email address.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "message": "Password reset email sent successfully. Please check your inbox."
}
```

**Error Response (400):**

```json
{
  "error": "Email is required"
}
```

**How it works:**

1. User provides their email address
2. Supabase sends a password reset email with a secure token
3. Email contains a link to your frontend reset page (e.g., `http://localhost:5173/reset-password?token=...`)
4. User clicks the link and is redirected to your frontend

---

### 2. Reset Password (with token)

**POST** `/api/auth/reset-password`

Updates the user's password using the reset token from the email.

**Headers:**

```
Authorization: Bearer <reset_token_from_email>
```

**Request Body:**

```json
{
  "password": "newSecurePassword123"
}
```

**Success Response (200):**

```json
{
  "message": "Password updated successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    ...
  }
}
```

**Error Responses:**

**401 Unauthorized:**

```json
{
  "error": "Authorization header missing"
}
```

**400 Bad Request:**

```json
{
  "error": "New password is required"
}
```

or

```json
{
  "error": "Password must be at least 6 characters long"
}
```

**How it works:**

1. User receives reset email and clicks the link
2. Frontend extracts the token from URL
3. Frontend sends new password with token in Authorization header
4. Backend updates the password

---

### 3. Change Password (authenticated)

**POST** `/api/auth/change-password`

Allows authenticated users to change their password by providing their current password.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword123"
}
```

**Success Response (200):**

```json
{
  "message": "Password changed successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    ...
  }
}
```

**Error Responses:**

**401 Unauthorized:**

```json
{
  "error": "Authorization header missing"
}
```

or

```json
{
  "error": "Invalid or expired token"
}
```

**400 Bad Request:**

```json
{
  "error": "Current password and new password are required"
}
```

or

```json
{
  "error": "Current password is incorrect"
}
```

or

```json
{
  "error": "New password must be at least 6 characters long"
}
```

**How it works:**

1. User is already logged in (has valid access token)
2. User provides current password and new password
3. Backend verifies current password
4. Backend updates to new password

---

## Frontend Integration Example

### 1. Request Password Reset

```javascript
const requestPasswordReset = async (email) => {
  const response = await fetch(
    "http://localhost:3000/api/auth/request-password-reset",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  const data = await response.json();
  return data;
};
```

### 2. Reset Password Page

```javascript
// Get token from URL query params
const urlParams = new URLSearchParams(window.location.search);
const resetToken = urlParams.get("token");

const resetPassword = async (newPassword) => {
  const response = await fetch(
    "http://localhost:3000/api/auth/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resetToken}`,
      },
      body: JSON.stringify({ password: newPassword }),
    }
  );

  const data = await response.json();
  return data;
};
```

### 3. Change Password (Settings Page)

```javascript
const changePassword = async (currentPassword, newPassword, accessToken) => {
  const response = await fetch(
    "http://localhost:3000/api/auth/change-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    }
  );

  const data = await response.json();
  return data;
};
```

---

## Supabase Email Configuration

To enable password reset emails, make sure your Supabase project has:

1. **Email Templates Configured** (in Supabase Dashboard → Authentication → Email Templates)
2. **SMTP Settings** (optional, for custom email provider)
3. **Redirect URLs Whitelisted** (in Supabase Dashboard → Authentication → URL Configuration)

Add your frontend URL to the allowed redirect URLs:

```
http://localhost:5173/reset-password
```

---

## Security Notes

1. Reset tokens expire after a certain time (configured in Supabase)
2. Passwords must be at least 6 characters long
3. Current password verification is required for password changes
4. All operations use Supabase's built-in authentication security
5. Tokens are validated on each request

---

## Testing with cURL

### Request Password Reset:

```bash
curl -X POST http://localhost:3000/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Reset Password:

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_RESET_TOKEN" \
  -d '{"password":"newPassword123"}'
```

### Change Password:

```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"currentPassword":"oldPassword123","newPassword":"newPassword123"}'
```

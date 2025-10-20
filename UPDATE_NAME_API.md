# Update User Name API Documentation

This API allows authenticated users to update their name in their profile.

## API Endpoint

### Update User Name
**PUT** `/api/auth/update-name`

Updates the authenticated user's name in the profiles table.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe"
}
```

**Success Response (200):**
```json
{
  "message": "Name updated successfully",
  "user": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
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
  "error": "Name is required"
}
```

---

## How It Works

1. User must be authenticated (have a valid access token)
2. User provides their new name in the request body
3. Backend validates the token and name
4. Backend updates the name in the `profiles` table
5. Backend returns the updated user profile

---

## Frontend Integration Example

### JavaScript/TypeScript
```javascript
const updateUserName = async (name, accessToken) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/update-name', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update name');
    }
    
    console.log('Name updated:', data.user);
    return data;
  } catch (error) {
    console.error('Error updating name:', error);
    throw error;
  }
};

// Usage
updateUserName('John Doe', 'your-access-token-here');
```

### React Example
```jsx
import { useState } from 'react';

function UpdateNameForm({ accessToken, currentName }) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/auth/update-name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSuccess(true);
      console.log('Updated user:', data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>Name updated successfully!</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Name'}
      </button>
    </form>
  );
}
```

---

## Testing with cURL

```bash
curl -X PUT http://localhost:3000/api/auth/update-name \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"John Doe"}'
```

---

## Validation Rules

1. **Name is required** - Cannot be empty or only whitespace
2. **Authentication required** - Must provide valid access token
3. **Name is trimmed** - Leading and trailing whitespace is removed automatically

---

## Security Notes

- ✅ Requires authentication (valid access token)
- ✅ Token is validated on each request
- ✅ Name input is trimmed to prevent whitespace-only names
- ✅ Updates only the authenticated user's profile
- ✅ Returns updated profile data for frontend state sync

---

## Common Use Cases

1. **User Settings Page** - Allow users to edit their profile name
2. **Profile Completion** - Prompt users to complete their profile after signup
3. **Account Management** - Part of a comprehensive account settings page

---

## Related Endpoints

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to get access token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-password` - Change password
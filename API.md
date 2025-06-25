# LingoBot API Documentation

This document describes the REST API endpoints for the LingoBot application.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Authentication

All API endpoints require authentication except for `/auth/*` endpoints. Authentication is handled via session cookies.

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "your-username",
  "password": "your-password"
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "new-username",
  "password": "new-password"
}
```

### Logout
```http
POST /auth/logout
```

## Chat Endpoints

### Get Messages
Retrieve all chat messages for the authenticated user.

```http
GET /api/messages
```

**Response:**
```json
[
  {
    "id": "uuid",
    "content": "Hello, how are you?",
    "metadata": {
      "role": "user",
      "sentiment": 4.2
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Send Message
Send a new message and receive an AI response.

```http
POST /api/messages
Content-Type: application/json

{
  "content": "Tell me a joke",
  "settings": {
    "temperature": 1.0,
    "systemPrompt": "You are a helpful AI assistant.",
    "mode": "general"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "content": "Here's a joke for you...",
  "metadata": {
    "role": "assistant",
    "sentiment": 3.0
  },
  "createdAt": "2024-01-15T10:31:00Z"
}
```

### Clear Messages
Clear all chat history for the authenticated user.

```http
POST /api/messages/clear
```

**Response:** `200 OK`

## Suggestions Endpoint

### Get Conversation Suggestions
Get AI-generated conversation suggestions based on chat history.

```http
GET /api/suggestions
```

**Response:**
```json
[
  "What's your favorite movie?",
  "Tell me about your day",
  "Can you help me with a problem?"
]
```

## User Endpoints

### Update Avatar Settings
Update the user's avatar customization settings.

```http
PATCH /api/user/avatar
Content-Type: application/json

{
  "settings": {
    "primaryColor": "hsl(142 76% 36%)",
    "secondaryColor": "hsl(142 76% 46%)",
    "shape": "circle",
    "style": "minimal",
    "animation": "bounce"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "username": "user123",
  "avatarSettings": {
    "primaryColor": "hsl(142 76% 36%)",
    "secondaryColor": "hsl(142 76% 46%)",
    "shape": "circle",
    "style": "minimal",
    "animation": "bounce"
  },
  "createdAt": "2024-01-15T10:00:00Z"
}
```

## Data Types

### Message
```typescript
interface Message {
  id: string;
  content: string;
  metadata: {
    role: "user" | "assistant" | "system";
    sentiment?: number;
  };
  createdAt: Date;
}
```

### ChatSettings
```typescript
interface ChatSettings {
  temperature: number;        // 0.1 - 2.0
  systemPrompt: string;       // Custom AI personality
  mode: "general" | "creative" | "focused";
}
```

### AvatarCustomization
```typescript
interface AvatarCustomization {
  primaryColor: string;       // HSL color value
  secondaryColor: string;     // HSL color value
  shape: "circle" | "square" | "rounded";
  style: "minimal" | "detailed" | "animated";
  animation: "bounce" | "pulse" | "wave" | "none";
}
```

### User
```typescript
interface User {
  id: number;
  username: string;
  avatarSettings: AvatarCustomization;
  createdAt: Date;
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "details": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Please log in to access this resource"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests",
  "message": "Please try again in 30 seconds"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Failed to process request"
}
```

## Rate Limiting

- **Limit**: 100 requests per minute (configurable)
- **Headers**: Rate limit information is included in response headers
- **Window**: 60 seconds (configurable)

## Environment Variables

Configure these in your `.env` file:

```env
# Required
SESSION_SECRET=your-session-secret
OPENAI_API_KEY=your-openai-api-key

# Optional
RATE_LIMIT=100
RATE_WINDOW=60000
DATABASE_URL=postgresql://user:pass@host:port/db
NODE_ENV=development
```

## Examples

### JavaScript/TypeScript
```javascript
// Send a message
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: 'Hello, AI!',
    settings: {
      temperature: 1.0,
      systemPrompt: 'You are a helpful assistant.',
      mode: 'general'
    }
  })
});

const message = await response.json();
console.log(message.content);
```

### cURL
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}' \
  -c cookies.txt

# Send message
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"content":"Hello","settings":{"temperature":1.0}}'
```

## WebSocket Support

For real-time features, the application supports WebSocket connections for:
- Real-time message delivery
- Typing indicators
- Avatar animations

WebSocket endpoint: `ws://localhost:3000/ws`

---

For more information, see the [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md) files. 
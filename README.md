git clone https://github.com/yourusername/ai-chat-assistant.git
cd ai-chat-assistant
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your required environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `SESSION_SECRET`: A secure random string for session encryption (required)
  - Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `DATABASE_URL`: PostgreSQL connection string (required)
- `RATE_LIMIT`: Number of requests per window (optional, default: 100)
- `RATE_WINDOW`: Time window in milliseconds (optional, default: 60000)

**Important Security Notes:**
- Never commit your `.env` file to version control
- Keep your API keys and secrets secure
- Generate a strong SESSION_SECRET for production use
- The `.env.example` file serves as a template with placeholder values

4. Start the development server
```bash
npm run dev
# LingoBot

LingoBot is an AI-powered chat application with secure authentication and customizable avatars. It uses React, Express, and the OpenAI API.

## Features
- 🤖 Interactive AI chat assistant
- 🔒 User authentication
- 🎨 Avatar customization
- 💡 Smart conversation suggestions
- 🌈 Responsive design
- 🔄 Real-time updates
- 📝 Markdown support

## Tech Stack
- React with TypeScript
- Express.js backend
- OpenAI GPT integration
- PostgreSQL with Drizzle ORM (optional)
- Tailwind CSS and ShadcnUI components

## Getting Started
1. Clone the repository and install dependencies
   ```bash
   git clone https://github.com/yourusername/ai-chat-assistant.git
   cd ai-chat-assistant
   npm install
   ```
2. Configure environment variables
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `OPENAI_API_KEY`, `SESSION_SECRET`, and optionally `DATABASE_URL`.
3. Start the development server
   ```bash
   npm run dev
   ```

### Local Database with Docker

If you don't have a PostgreSQL server available, you can start one using Docker:

```bash
docker-compose up -d
```

This will launch a database listening on `localhost:5432` with credentials
`lingobot`/`lingobot`. Update your `.env` with:

```bash
DATABASE_URL=postgresql://lingobot:lingobot@localhost:5432/lingobot
```

After the database is running, initialize the schema:

```bash
npm run db:push
```

## Running the Standalone Executable
1. Download the appropriate executable for your platform:
   - `ai-chat-assistant-win.exe`
   - `ai-chat-assistant-macos`
   - `ai-chat-assistant-linux`
2. Place a `.env` file next to the executable and set the required variables as shown in `.env.example`.
3. On macOS or Linux make it executable and run it:
   ```bash
   chmod +x ./ai-chat-assistant-*
   ./ai-chat-assistant-*
   ```

## Development Guidelines
- Never commit your `.env` file
- Use `npm run db:push` for schema changes
- Follow TypeScript and ESLint/Prettier conventions

## Building Executables
```bash
npm install
node scripts/build-executable.js
```
Executables will be created in `executables/`.

## Production Deployment
```bash
npm run build
npm run start
```

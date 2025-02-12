# AI Chat Assistant

A cutting-edge AI chatbot application with robust user authentication and advanced conversational intelligence, focusing on secure and engaging user interactions.

## Features

- 🤖 Interactive AI Chat Assistant
- 🔒 Secure User Authentication
- 🎨 Customizable Chat Avatar
- 💡 Smart Conversation Suggestions
- 🌈 Beautiful, Responsive Design
- 🔄 Real-time Message Updates
- 🎭 Sentiment Analysis
- 📝 Markdown Support for Messages

## Tech Stack

- React with TypeScript
- Express.js Backend
- OpenAI GPT-4 Integration
- PostgreSQL Database (optional)
- Drizzle ORM
- Tailwind CSS
- Framer Motion
- ShadcnUI Components

## Getting Started

1. Clone the repository
```bash
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
Edit `.env` and add your OpenAI API key and other configuration

4. Start the development server
```bash
npm run dev
```

The application will be available at http://localhost:5000

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `DATABASE_URL`: PostgreSQL connection string (optional)
- `SESSION_SECRET`: Secret for session management (required in production)

### Optional Database Setup

By default, the application uses in-memory storage. To enable PostgreSQL:

1. Set up a PostgreSQL database
2. Add the `DATABASE_URL` to your `.env` file
3. Run `npm run db:push` to create the database schema

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

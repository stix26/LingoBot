# LingoBot 🤖

LingoBot is an AI-powered chat application with secure authentication and customizable avatars. It uses React, Express, and the OpenAI API to provide an engaging conversational experience.

## 🎥 Demo

📹 **Watch LingoBot in Action**: [Demo Video](https://drive.google.com/file/d/1RVS8WFLJ1ja6GwAg5spCUFhsf3O8LiEM/view?usp=sharing)

## ✨ Features

- 🤖 **Interactive AI Chat Assistant** - Powered by OpenAI GPT with intelligent responses
- 🔒 **Secure User Authentication** - Local authentication with session management
- 🎨 **Customizable Avatar** - Personalize your AI companion's appearance
- 💡 **Smart Conversation Suggestions** - Context-aware conversation starters
- 🌈 **Responsive Design** - Beautiful UI that works on all devices
- 🔄 **Real-time Updates** - Instant message delivery and typing indicators
- 📝 **Markdown Support** - Rich text formatting in chat messages
- 🎭 **Sentiment Analysis** - AI mascot reacts to conversation mood
- 🎯 **Multiple Chat Modes** - General, creative, and focused conversation modes
- 🚀 **Hot Reload Development** - Fast development with Vite

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **ShadcnUI** components for consistent design
- **Framer Motion** for smooth animations
- **React Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** server with TypeScript
- **OpenAI GPT** integration for AI responses
- **Passport.js** for authentication
- **Express Session** for session management
- **Drizzle ORM** for database operations
- **Zod** for schema validation

### Database
- **PostgreSQL** (optional) with Drizzle ORM
- **In-memory storage** for development
- **Session storage** with automatic cleanup

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lingobot.git
   cd lingobot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```env
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production
   OPENAI_API_KEY=your-actual-openai-api-key-here
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup (Optional)

For persistent storage, you can use PostgreSQL:

1. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

2. **Update your `.env` file**
   ```env
   DATABASE_URL=postgresql://lingobot:lingobot@localhost:5432/lingobot
   ```

3. **Initialize the database schema**
   ```bash
   npm run db:push
   ```

## 📱 Usage

### Authentication
- Create a new account or log in with existing credentials
- Sessions are automatically managed and secured

### Chat Interface
- **Send Messages**: Type your message and press Enter or click Send
- **Conversation Suggestions**: Click on suggestion chips for quick conversation starters
- **Avatar Customization**: Click the avatar icon to customize your AI companion
- **Clear Chat**: Use the clear button to start fresh conversations

### Avatar Customization
- **Primary Color**: Main color of your avatar
- **Secondary Color**: Accent color for details
- **Shape**: Choose between circle, square, or rounded
- **Style**: Minimal, detailed, or animated styles
- **Animation**: Bounce, pulse, or wave animations

## 🏗️ Development

### Project Structure
```
LingoBot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── lib/               # Backend utilities
│   ├── routes.ts          # API routes
│   ├── auth.ts            # Authentication logic
│   └── storage.ts         # Data storage layer
├── shared/                # Shared types and schemas
└── scripts/               # Build and deployment scripts
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
npm run db:push      # Push database schema changes
```

### Development Guidelines
- ✅ Use TypeScript for type safety
- ✅ Follow ESLint and Prettier conventions
- ✅ Never commit `.env` files
- ✅ Use `npm run db:push` for schema changes
- ✅ Test API endpoints before deployment

## 🚀 Production Deployment

### Building for Production
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
NODE_ENV=production
SESSION_SECRET=your-very-secure-session-secret
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=your-production-database-url
```

### Standalone Executable
Build platform-specific executables:
```bash
npm install
node scripts/build-executable.js
```

Executables will be created in `executables/` directory.

## 🔧 Configuration

### Chat Settings
- **Temperature**: Controls response creativity (0.1 - 2.0)
- **System Prompt**: Customize AI personality and behavior
- **Mode**: General, creative, or focused conversation modes

### Rate Limiting
Configure in `.env`:
```env
RATE_LIMIT=100        # Requests per window
RATE_WINDOW=60000     # Window in milliseconds
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for providing the GPT API
- [ShadcnUI](https://ui.shadcn.com/) for beautiful UI components
- [Vite](https://vitejs.dev/) for fast development experience
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework

---

**Made with ❤️ for better AI conversations**

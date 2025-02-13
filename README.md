2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your required environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `SESSION_SECRET`: A secure random string for session encryption (required)
  - Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `DATABASE_URL`: PostgreSQL connection string (required)

4. Start the development server:
```bash
npm run dev
```

### Running the Standalone Executable

1. Download the appropriate executable for your platform from the releases page:
   - Windows: `ai-chat-assistant-win.exe`
   - macOS: `ai-chat-assistant-macos`
   - Linux: `ai-chat-assistant-linux`

2. Create a `.env` file in the same directory as the executable with the following required environment variables:
   ```env
   # Required: Your OpenAI API Key from https://platform.openai.com/account/api-keys
   OPENAI_API_KEY=your_api_key_here

   # Required: A secure random string for session encryption
   # Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   SESSION_SECRET=your_session_secret_here

   # Required: PostgreSQL connection string
   # Format: postgresql://user:password@host:port/database
   DATABASE_URL=your_database_url_here
   ```

3. Run the executable:
   - Windows: Double-click the `.exe` file or run from command prompt
   - macOS/Linux: 
     ```bash
     chmod +x ./ai-chat-assistant-*
     ./ai-chat-assistant-*
     ```

   If any required environment variables are missing, the application will display an error message with instructions on how to set them up.

## Development Guidelines

1. Environment Variables
   - Never commit your `.env` file
   - Keep your API keys and secrets secure
   - Use strong SESSION_SECRET in production
   - The `.env.example` file serves as a template

2. Database Management
   - Use `npm run db:push` for schema changes
   - Never manually modify the database schema
   - Back up data before schema changes

3. Code Style
   - Follow TypeScript best practices
   - Use ESLint and Prettier for formatting
   - Write meaningful commit messages

## Building Executables

To build the executables yourself:

```bash
# Install dependencies
npm install

# Build the executables
node scripts/build-executable.js
```

The executables will be created in the `executables/` directory.

## Production Deployment

1. Build the application
```bash
npm run build
```

2. Start the production server
```bash
npm run start
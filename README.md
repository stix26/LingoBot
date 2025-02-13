chmod +x ai-chat-assistant-macos
   ```

#### Linux Users
1. Download `ai-chat-assistant-linux`
2. Open terminal and navigate to the download folder
3. Make the file executable:
   ```bash
   chmod +x ai-chat-assistant-linux
   ```

### Step 2: Set Up Environment Variables

Before running the application, you need to set up the required environment variables:

1. Create a file named `.env` in the same folder as the executable
2. Add the following content to the `.env` file:
   ```env
   # Required: Your OpenAI API Key
   # Get from https://platform.openai.com/account/api-keys
   OPENAI_API_KEY=your_api_key_here

   # Required: A secure random string for session encryption
   # Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   SESSION_SECRET=your_session_secret_here

   # Required: PostgreSQL connection string
   # Format: postgresql://user:password@host:port/database
   DATABASE_URL=your_database_url_here
   ```

### Step 3: Running the Application

#### Windows:
- Double-click the `ai-chat-assistant-win.exe` file
- Or run from Command Prompt:
  ```cmd
  ai-chat-assistant-win.exe
  ```

#### macOS:
```bash
./ai-chat-assistant-macos
```

#### Linux:
```bash
./ai-chat-assistant-linux
```

### Troubleshooting

1. If you see "Missing environment variables" error:
   - Make sure the `.env` file is in the same directory as the executable
   - Verify all required variables are properly set

2. If you get a permission denied error (macOS/Linux):
   - Run `chmod +x ./ai-chat-assistant-*` to make the file executable

3. For Windows SmartScreen warning:
   - Click "More info"
   - Select "Run anyway"

4. Database connection issues:
   - Verify your DATABASE_URL is correct
   - Ensure the PostgreSQL server is running
   - Check if the database exists and is accessible

5. OpenAI API issues:
   - Verify your OPENAI_API_KEY is valid
   - Check if you have sufficient API credits

For additional help or to report issues, please visit our support page.

## Development Setup

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
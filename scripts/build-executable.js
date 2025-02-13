#!/usr/bin/env node

import { execSync } from 'child_process';
import { mkdir, rm } from 'fs/promises';
import { platform } from 'os';

async function buildExecutable() {
  try {
    // Build frontend and backend
    console.log('Building application...');
    execSync('npm run build', { stdio: 'inherit' });

    // Clean and recreate executables directory
    console.log('Preparing executables directory...');
    await rm('executables', { recursive: true, force: true });
    await mkdir('executables', { recursive: true });

    // Platform-specific naming
    const platformExtensions = {
      win32: '.exe',
      darwin: '-macos',
      linux: '-linux'
    };

    console.log('Creating executables...');
    execSync(
      `pkg dist/index.js --config pkg.config.json --compress GZip --target node18-win-x64,node18-macos-x64,node18-linux-x64 --output executables/ai-chat-assistant`,
      { stdio: 'inherit' }
    );

    console.log('Executable created successfully in executables/ directory');
    console.log('Please verify the executables at:');
    console.log('- Windows: executables/ai-chat-assistant.exe');
    console.log('- macOS:   executables/ai-chat-assistant-macos');
    console.log('- Linux:   executables/ai-chat-assistant-linux');
  } catch (error) {
    console.error('Error creating executable:', error);
    process.exit(1);
  }
}

buildExecutable();
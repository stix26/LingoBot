#!/usr/bin/env node

import { execSync } from 'child_process';
import { mkdir } from 'fs/promises';
import { platform } from 'os';

async function buildExecutable() {
  try {
    // Build frontend and backend
    console.log('Building application...');
    execSync('npm run build', { stdio: 'inherit' });

    // Create executables directory
    await mkdir('executables', { recursive: true });

    // Platform-specific naming
    const platformExtensions = {
      win32: '.exe',
      darwin: '-macos',
      linux: '-linux'
    };

    // Use pkg to create executable with explicit entry point and platform-specific naming
    console.log('Creating executable...');
    execSync(
      `pkg dist/index.js --config pkg.config.json --compress GZip --output executables/ai-chat-assistant${platformExtensions[platform()] || ''}`,
      { stdio: 'inherit' }
    );

    console.log('Executable created successfully in executables/ directory');
  } catch (error) {
    console.error('Error creating executable:', error);
    process.exit(1);
  }
}

buildExecutable();
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];

function start(label, cwd, args) {
  const child = spawn(npmCommand, args, {
    cwd,
    env: process.env,
    shell: process.platform === 'win32',
    stdio: ['inherit', 'pipe', 'pipe']
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[${label}] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[${label}] ${chunk}`));
  child.on('exit', (code, signal) => {
    if (code && code !== 0) process.exitCode = code;
    if (signal) process.exitCode = 1;
  });
  children.push(child);
}

start('api', root, ['run', 'dev']);
start('frontend', resolve(root, 'frontend'), ['run', 'dev']);

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);

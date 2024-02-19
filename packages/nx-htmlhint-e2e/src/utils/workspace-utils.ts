import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { dirname, resolve } from 'path';
import { cwd } from 'process';

export function getWorkspaceDirectory(workspaceName: string): string {
  return resolve('tmp', workspaceName);
}

export function removeWorkspace(workspaceName: string): void {
  const workspaceDirectory = getWorkspaceDirectory(workspaceName);

  // Ensure projectDirectory is empty
  rmSync(resolve(workspaceDirectory, '.nx'), {
    force: true,
    recursive: true,
    retryDelay: 2000,
    maxRetries: 5,
  });

  // Ensure projectDirectory is empty
  rmSync(workspaceDirectory, {
    force: true,
    recursive: true,
    retryDelay: 2000,
    maxRetries: 5,
  });
}

export function createWorkspace(
  workspaceName: string,
  options?: { recreate?: boolean }
) {
  const workspaceDirectory = getWorkspaceDirectory(workspaceName);

  // no need to recreate
  const hasWorkspace = existsSync(workspaceDirectory);
  if (hasWorkspace && !options?.recreate) {
    return workspaceDirectory;
  }

  // delete before creation
  if (options?.recreate) {
    removeWorkspace(workspaceName);
  }

  // create dir holding workspace
  mkdirSync(dirname(workspaceDirectory), {
    recursive: true,
  });

  // create workspace
  execSync(
    `npx --yes create-nx-workspace@latest ${workspaceName} --preset=apps --nxCloud=skip`,
    {
      cwd: resolve(cwd(), 'tmp'),
      env: process.env,
      stdio: 'inherit',
    }
  );

  // add web plugin to generate projects
  execSync(`nx add @nx/web`, {
    cwd: workspaceDirectory,
    env: process.env,
    stdio: 'inherit',
  });

  // install our plugin
  execSync(`npm install @wrckt/nx-htmlhint@e2e`, {
    cwd: workspaceDirectory,
    env: process.env,
    stdio: 'inherit',
  });

  return workspaceDirectory;
}

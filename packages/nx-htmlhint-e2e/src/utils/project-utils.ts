import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { resolve } from 'path';

import { getWorkspaceDirectory } from './workspace-utils';

export function getProjectDirectory(
  workspaceName: string,
  projectName: string
): string {
  const workspaceDirectory = getWorkspaceDirectory(workspaceName);
  return resolve(workspaceDirectory, projectName);
}

// delete project from workspace
export function removeProject(
  workspaceName: string,
  projectName: string
): void {
  const projectDirectory = getProjectDirectory(workspaceName, projectName);

  rmSync(projectDirectory, {
    recursive: true,
    force: true,
    retryDelay: 2000,
    maxRetries: 5,
  });
}

// removes previous project, then creates project in workspace
export function addProjectToWorkSpace(
  workspaceName: string,
  projectName: string
): { projectName; projectDirectory; workspaceName; workspaceDirectory } {
  const workspaceDirectory = getWorkspaceDirectory(workspaceName);
  const projectDirectory = getProjectDirectory(workspaceName, projectName);

  // always delete projects to include init, configuration generations
  removeProject(workspaceName, projectName);

  // generate bare web:app as projcet to target
  execSync(
    `npx nx g @nx/web:app ${projectName} --e2e-test-runner=none --style=css --bundler=none`,
    {
      cwd: workspaceDirectory,
      stdio: 'inherit',
    }
  );

  return { projectName, projectDirectory, workspaceName, workspaceDirectory };
}

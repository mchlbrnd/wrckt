import { execSync } from 'child_process';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

describe('nx-htmlhint', () => {
  it('should be installed', () => {
    const { workspaceDirectory } = createTestWorkspaceWithProject('install');
    // npm ls will fail if the package is not installed properly
    execSync('npm ls @wrckt/nx-htmlhint', {
      cwd: workspaceDirectory,
      stdio: 'inherit',
    });
  });

  it('should run lint executor without project configuration 1 valid html file', () => {
    const projectName = 'without-config';
    const { workspaceDirectory } = createTestWorkspaceWithProject(projectName);

    // test target from fresh web app
    const output = execSync(
      `npx nx run ${projectName}:htmlhint --skip-nx-cache`,
      {
        cwd: workspaceDirectory,
      }
    ).toString();

    console.log(output);
    expect(output).toMatch(new RegExp('Config loaded: .+?.htmlhintrc'));
    expect(output).toMatch('Scanned 1 files, no errors found');
  });

  it('should run lint executor with project configuration with 1 valid and 1 invalid html files', () => {
    const projectName = 'with-config-add-html-invalid';
    const { projectDirectory, workspaceDirectory } =
      createTestWorkspaceWithProject(projectName);

    // edit html with invalid data and test target
    const file = join(projectDirectory, 'src', 'app', 'app.element.html');
    writeFileSync(file, '<img alt="an image" src />');

    try {
      execSync(`npx nx run ${projectName}:htmlhint --skip-nx-cache`, {
        cwd: workspaceDirectory,
      }).toString();
    } catch (error: any) {
      const output = error.output.toString();

      console.log(output);
      expect(output).toMatch('src-not-empty');
      expect(output).toMatch('Scanned 2 files, found 1 errors in 1 files');
    }
  });

  it('should run lint executor with project configuration with2 2 valid html files', () => {
    const projectName = 'with-config-add-html-valid';
    const { projectDirectory, workspaceDirectory } =
      createTestWorkspaceWithProject(projectName);

    // add valid html to web app and test target
    const file = join(projectDirectory, 'src', 'app', 'app.element.html');
    writeFileSync(file, '<img alt="an image" src="img.jpg" />');
    const output = execSync(
      `npx nx run ${projectName}:htmlhint --skip-nx-cache`,
      {
        cwd: workspaceDirectory,
      }
    ).toString();

    console.log(output);
    expect(output).toMatch('Scanned 2 files, no errors found');
  });

  it('should run lint executor with project configuration with 1 valid html file', () => {
    const projectName = 'with-config';
    const { workspaceDirectory } = createTestWorkspaceWithProject(projectName);

    // test target from fresh web app
    const output = execSync(
      `npx nx run ${projectName}:htmlhint --skip-nx-cache`,
      {
        cwd: workspaceDirectory,
      }
    ).toString();

    console.log(output);
    expect(output).toMatch(new RegExp(projectName + '/.htmlhintrc'));
    expect(output).toMatch('Scanned 1 files, no errors found');
  });
});

/**
 * Deletes a test project (workaround for busy resource on Windows)
 */
function deleteTestWorkspace(workspaceName: string) {
  const workspaceDirectory = join(process.cwd(), 'tmp', workspaceName);
  // workaround on Windows otherwise next rm does error with EBUSY
  rmSync(join(workspaceDirectory, '.nx'), {
    recursive: true,
    force: true,
    retryDelay: 2000,
    maxRetries: 5,
  });

  // Ensure projectDirectory is empty
  rmSync(workspaceDirectory, {
    recursive: true,
    force: true,
    retryDelay: 2000,
    maxRetries: 5,
  });

  return workspaceDirectory;
}

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 */
function createTestWorkspace(workspaceName: string) {
  // start with clean project dir
  const workspaceDirectory = deleteTestWorkspace(workspaceName);

  mkdirSync(dirname(workspaceDirectory), {
    recursive: true,
  });

  execSync(
    `npx --yes create-nx-workspace@18.0.3 ${workspaceName} --preset=apps --nxCloud=skip`,
    {
      cwd: dirname(workspaceDirectory),
      stdio: 'inherit',
      env: process.env,
    }
  );

  execSync(`npx nx add @nx/web`, {
    cwd: workspaceDirectory,
    stdio: 'inherit',
  });

  execSync(`npm install @wrckt/nx-htmlhint@e2e`, {
    cwd: workspaceDirectory,
    stdio: 'inherit',
    env: process.env,
  });

  return workspaceDirectory;
}

function createTestProject(
  cwd: string,
  projectName: string,
  withConfig = true
) {
  execSync(
    `npx nx g @nx/web:app ${projectName} --e2e-test-runner=none --style=css --bundler=none`,
    {
      cwd,
      stdio: 'inherit',
    }
  );

  execSync(`npx nx g @wrckt/nx-htmlhint:init`, {
    cwd,
    stdio: 'inherit',
  });

  execSync(
    `npx nx g @wrckt/nx-htmlhint:configuration --projectName=${projectName} --with-config=${withConfig}`,
    {
      cwd,
      stdio: 'inherit',
    }
  );
  return join(cwd, projectName);
}

function createTestWorkspaceWithProject(
  workspaceName: string,
  projectName?: string
): { workspaceDirectory; projectDirectory } {
  projectName ??= workspaceName;

  const workspaceDirectory = createTestWorkspace(workspaceName);

  const projectDirectory = createTestProject(workspaceDirectory, projectName);

  return { workspaceDirectory, projectDirectory };
}

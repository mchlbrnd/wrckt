import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { createWorkspace, removeWorkspace } from './utils/workspace-utils';
import { addProjectToWorkSpace } from './utils/project-utils';

const WORKSPACE_NAME = 'test-workspace';

beforeAll(() => {
  createWorkspace(WORKSPACE_NAME, { recreate: true });
});

afterAll(() => {
  removeWorkspace(WORKSPACE_NAME);
});

describe('nx-htmlhint', () => {
  it('should be installed', () => {
    const { workspaceDirectory } = addProjectToWorkSpace(
      WORKSPACE_NAME,
      'install'
    );

    // npm ls will fail if the package is not installed properly
    execSync(`npm ls @wrckt/nx-htmlhint`, {
      cwd: workspaceDirectory,
      stdio: 'inherit',
    });
  });

  it('should run lint executor without project configuration 1 valid html file', () => {
    const { projectName, workspaceDirectory } = addProjectToWorkSpace(
      WORKSPACE_NAME,
      'without-config'
    );

    // run configuration without project config file
    execSync(
      `npx nx g @wrckt/nx-htmlhint:configuration --projectName=${projectName} --with-project-config=false`,
      {
        cwd: workspaceDirectory,
        stdio: 'inherit',
      }
    );

    // run htmlhint target for current project
    const result = execSync(
      `npx nx run ${projectName}:htmlhint --skip-nx-cache`,
      {
        cwd: workspaceDirectory,
      }
    ).toString();

    expect(result).toMatch(new RegExp('Config loaded: .+?.htmlhintrc'));
    expect(result).toMatch('Scanned 1 files, no errors found');
  });

  it('should run lint executor with project configuration with 1 valid and 1 invalid html files', () => {
    const { projectDirectory, projectName, workspaceDirectory } =
      addProjectToWorkSpace(WORKSPACE_NAME, 'with-config-add-html-invalid');

    // run configuration with project config file
    execSync(
      `npx nx g @wrckt/nx-htmlhint:configuration --projectName=${projectName} --with-project-config=true`,
      {
        cwd: workspaceDirectory,
        stdio: 'inherit',
      }
    );

    // edit html with invalid data and test target
    const file = join(projectDirectory, 'src', 'app', 'app.element.html');
    writeFileSync(file, '<img alt="an image" src />');

    // should throw with html validation errors
    try {
      execSync(`npx nx run ${projectName}:htmlhint --skip-nx-cache`, {
        cwd: workspaceDirectory,
      });
    } catch ({ stdout }) {
      const result = stdout.toString();
      expect(result).toMatch('src-not-empty');
      expect(result).toMatch('Scanned 2 files, found 1 errors in 1 files');
    }
  });

  it('should run lint executor with project configuration with 2 valid html files', () => {
    const { projectDirectory, projectName, workspaceDirectory } =
      addProjectToWorkSpace(WORKSPACE_NAME, 'with-config-add-html-valid');

    // run configuration generator (adds target to project, adds .htmlhintrc to projectRoot or workspaceRoot depending on withConfig)
    execSync(
      `npx nx g @wrckt/nx-htmlhint:configuration --projectName=${projectName} --with-project-config=true`,
      {
        cwd: workspaceDirectory,
        stdio: 'inherit',
      }
    );

    // add valid html to web app and test target
    const file = join(projectDirectory, 'src', 'app', 'app.element.html');
    writeFileSync(file, '<img alt="an image" src="img.jpg" />');

    const result = execSync(
      `npx nx run ${projectName}:htmlhint --skip-nx-cache`,
      {
        cwd: workspaceDirectory,
      }
    ).toString();

    expect(result).toMatch('Scanned 2 files, no errors found');
  });

  it('should run lint executor with project configuration with 1 valid html file', () => {
    const { projectName, workspaceDirectory } = addProjectToWorkSpace(
      WORKSPACE_NAME,
      'with-config'
    );

    // run configuration generator (adds target to project, adds .htmlhintrc to projectRoot or workspaceRoot depending on withConfig)
    execSync(
      `npx nx g @wrckt/nx-htmlhint:configuration --projectName=${projectName} --with-project-config=true`,
      {
        cwd: workspaceDirectory,
        stdio: 'inherit',
      }
    );

    // test target from fresh web app
    const result = execSync(
      `npx nx run ${projectName}:htmlhint --skip-nx-cache`,
      {
        cwd: workspaceDirectory,
      }
    ).toString();

    expect(result).toMatch(new RegExp(projectName + '/.htmlhintrc'));
    expect(result).toMatch('Scanned 1 files, no errors found');
  });
});


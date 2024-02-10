import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
  Tree,
  addProjectConfiguration,
  joinPathFragments,
  logger,
  readJson,
  readProjectConfiguration,
} from '@nx/devkit';

import generator from './generator';
import { HTMLHINT_CONFIG, HTMLHINT_CONFIG_RULES } from '../../utils/utils';

describe('configuration generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'project', { targets: {}, root: 'project/' });
  });

  it('should create target htmlhint for project without private config', async () => {
    await generator(tree, { projectName: 'project' });

    // should create root config
    const rootConfig = readJson(tree, HTMLHINT_CONFIG);
    expect(rootConfig).toStrictEqual(HTMLHINT_CONFIG_RULES);

    // shoud not create private config for project
    expect(
      tree.exists(joinPathFragments('project', HTMLHINT_CONFIG))
    ).toBeFalsy();

    // should add target for root config
    const projectConfiguration = readProjectConfiguration(tree, 'project');
    expect(projectConfiguration.targets['htmlhint']).toStrictEqual({
      executor: '@wrckt/nx-htmlhint:lint',
      outputs: ['{options.outputFile}'],
      options: {
        config: `{workspaceRoot}/${HTMLHINT_CONFIG}`,
        target: '{projcetRoot}/**/*',
      },
    });
  });

  it('should create target htmlhint for project with private config', async () => {
    await generator(tree, { projectName: 'project', withConfig: true });

    // should create private config for project
    const projectConfig = readJson(
      tree,
      joinPathFragments('project', HTMLHINT_CONFIG)
    );
    expect(projectConfig).toStrictEqual(HTMLHINT_CONFIG_RULES);

    // should not create root config
    expect(tree.exists(HTMLHINT_CONFIG)).toBeFalsy();

    // should add target for project config
    const projectConfiguration = readProjectConfiguration(tree, 'project');
    expect(projectConfiguration.targets['htmlhint']).toStrictEqual({
      executor: '@wrckt/nx-htmlhint:lint',
      outputs: ['{options.outputFile}'],
      options: {
        config: `{projectRoot}/${HTMLHINT_CONFIG}`,
        target: '{projcetRoot}/**/*',
      },
    });
  });

  it('should error when project is not found in workspace', async () => {
    logger.error = jest.fn();

    await generator(tree, { projectName: 'tcejorp' });
    expect(logger.error).toHaveBeenCalledWith(
      `Unable to find project 'tcejorp' in current workspace. Please make sure project exists!`
    );
  });

  it('should error when project already has htmlhint target', async () => {
    logger.error = jest.fn();

    await generator(tree, { projectName: 'project' });
    const config = readProjectConfiguration(tree, 'project');
    expect(config.targets['htmlhint']).toBeDefined();

    await generator(tree, { projectName: 'project' });
    expect(logger.error).toHaveBeenCalledWith(
      `Target htmlhint already exists on project 'project'!`
    );
  });
});

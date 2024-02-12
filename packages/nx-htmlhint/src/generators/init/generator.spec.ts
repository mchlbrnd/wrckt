import {
  NxJsonConfiguration,
  Tree,
  addProjectConfiguration,
  joinPathFragments,
  logger,
  readJson,
  updateJson,
  writeJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import {
  HTMLHINT_CONFIG,
  HTMLHINT_CONFIG_RULES,
  HTMLHINT_SEMVER,
  HTMLHINT_TARGET_PATTERN,
} from '../../utils/utils';
import generator from './generator';
import { InitGeneratorSchema } from './schema';

const defaultOptions: InitGeneratorSchema = {
  skipFormat: false,
};

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'project', { root: 'project/' });
    writeJson(tree, 'package.json', {
      dependencies: {},
      devDependencies: {},
    });
  });

  it('should add dependencies and create configuration in workspaceRoot', async () => {
    await generator(tree, defaultOptions);

    const packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['htmlhint']).toBeFalsy();
    expect(packagejson.devDependencies['htmlhint']).toBe(HTMLHINT_SEMVER);

    const config = readJson(tree, '.htmlhintrc');
    expect(config).toStrictEqual(HTMLHINT_CONFIG_RULES);
  });

  it('should add dependencies and create configuration in projectRoot', async () => {
    await generator(tree, { ...defaultOptions, projectName: 'project' });

    const packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['htmlhint']).toBeFalsy();
    expect(packagejson.devDependencies['htmlhint']).toBe(HTMLHINT_SEMVER);

    const config = readJson(tree, joinPathFragments('project', '.htmlhintrc'));
    expect(config).toStrictEqual(HTMLHINT_CONFIG_RULES);
  });

  it('should skip creation of .htmlhintrc', async () => {
    logger.warn = jest.fn();
    writeJson(tree, '.htmlhintrc', {});

    await generator(tree, defaultOptions);

    expect(logger.warn).toHaveBeenCalledWith(
      "Config file .htmlhintrc already exists in path '.'. Skipping creation of .htmlhintrc!"
    );
  });

  it('should not add htmlhint to devDependencies when present in dependencies', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.dependencies['htmlhint'] = '0.0.0';
      return json;
    });

    let packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['htmlhint']).toBe('0.0.0');

    await generator(tree, defaultOptions);

    packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['htmlhint']).toBe('0.0.0');
    expect(packagejson.devDependencies['htmlhint']).toBeUndefined();
  });

  describe('targetDefaults', () => {
    it('should add targetDefaults for htmlhint', async () => {
      updateJson<NxJsonConfiguration>(tree, 'nx.json', (json) => {
        json.namedInputs ??= {};
        json.namedInputs['production'] = ['default'];
        return json;
      });

      await generator(tree, defaultOptions);

      const nxConfig = readJson<NxJsonConfiguration>(tree, 'nx.json');

      expect(nxConfig.targetDefaults?.['htmlhint']).toStrictEqual({
        cache: true,
        inputs: ['default'],
        outputs: ['{options.outputFile}'],
        options: {
          config: `{workspaceRoot}/${HTMLHINT_CONFIG}`,
          target: `{projectRoot}/${HTMLHINT_TARGET_PATTERN}`,
        },
      });
      expect(nxConfig.namedInputs?.['production']).toStrictEqual([
        'default',
        `!{projectRoot}/${HTMLHINT_CONFIG}`,
      ]);
    });

    it('should not create namedInputs production fileset if not present', async () => {
      updateJson<NxJsonConfiguration>(tree, 'nx.json', (json) => {
        json.namedInputs ??= {};
        delete json.namedInputs['production'];
        return json;
      });

      await generator(tree, defaultOptions);

      const nxConfig = readJson<NxJsonConfiguration>(tree, 'nx.json');

      expect(nxConfig.namedInputs?.['production']).toBeUndefined();
    });
  });
});

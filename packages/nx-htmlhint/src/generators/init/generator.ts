import {
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
  updateNxJson as devkitUpdateNxJson,
  formatFiles,
  joinPathFragments,
  logger,
  readJson,
  readNxJson,
  readProjectConfiguration,
  stripIndents,
  writeJson,
} from '@nx/devkit';
import {
  HTMLHINT_CONFIG,
  HTMLHINT_CONFIG_RULES,
  HTMLHINT_SEMVER,
  HTMLHINT_LINT_FILE_PATTERN,
} from '../../utils/utils';
import { InitGeneratorSchema } from './schema';

export const initGenerator = async (
  tree: Tree,
  options: InitGeneratorSchema
): Promise<GeneratorCallback> => {
  const installTask = updateNpmDependencies(tree);
  createConfigurationFile(tree, options);
  updateNxJson(tree);

  if (!options?.skipFormat) {
    await formatFiles(tree);
  }
  return installTask;
};

const createConfigurationFile = (
  tree: Tree,
  { projectName }: InitGeneratorSchema
) => {
  const path = projectName
    ? readProjectConfiguration(tree, projectName).root
    : '.';

  const config = joinPathFragments(path, HTMLHINT_CONFIG);
  if (!tree.exists(config)) {
    writeJson(tree, config, HTMLHINT_CONFIG_RULES);
  } else {
    logger.warn(
      stripIndents`Config file ${HTMLHINT_CONFIG} already exists in path '${path}'. Skipping creation of ${HTMLHINT_CONFIG}!`
    );
  }
};

const updateNpmDependencies = (tree: Tree): GeneratorCallback => {
  const packageJson = readJson(tree, 'package.json');
  const devDependencies: Record<string, string> = {};

  if (!packageJson?.dependencies?.['htmlhint']) {
    devDependencies['htmlhint'] = HTMLHINT_SEMVER;
  }
  return addDependenciesToPackageJson(tree, {}, devDependencies);
};

const updateNxJson = (tree: Tree) => {
  const nxJson = readNxJson(tree);
  if (!nxJson) {
    return logger.warn(
      stripIndents`Did not find nx.json. Create a nx.json file and rerun the generator with 'nx run nx-stylelint:init' to configure nx-stylelint inputs and taskrunner options.`
    );
  }

  const configInProject = `!${joinPathFragments(
    '{projectRoot}',
    HTMLHINT_CONFIG
  )}`;
  if (
    nxJson.namedInputs?.['production'] &&
    !nxJson.namedInputs?.['production'].includes(configInProject)
  ) {
    nxJson.namedInputs?.['production'].push(configInProject);
  }

  nxJson.targetDefaults ??= {};
  nxJson.targetDefaults['htmlhint'] ??= {};
  nxJson.targetDefaults['htmlhint'].cache = true;
  nxJson.targetDefaults['htmlhint'].inputs ??= ['default'];
  nxJson.targetDefaults['htmlhint'].outputs ??= ['{options.outputFile}'];
  nxJson.targetDefaults['htmlhint'].options ??= {
    config: joinPathFragments('{workspaceRoot}', HTMLHINT_CONFIG),
    lintFilePattern: joinPathFragments(
      '{projectRoot}',
      HTMLHINT_LINT_FILE_PATTERN
    ),
  };

  devkitUpdateNxJson(tree, nxJson);
};

export default initGenerator;

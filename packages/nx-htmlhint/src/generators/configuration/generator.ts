import {
  formatFiles,
  logger,
  readProjectConfiguration,
  stripIndents,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { ConfigurationGeneratorSchema } from './schema';
import { HTMLHINT_CONFIG } from '../../utils/utils';
import initGenerator from '../init/generator';

export const configurationGenerator = async (
  tree: Tree,
  options: ConfigurationGeneratorSchema
) => {
  let projectConfiguration;
  const { projectName, withConfig, skipFormat } = options;
  try {
    projectConfiguration = readProjectConfiguration(tree, projectName);

    if (projectConfiguration?.targets?.['htmlhint']) {
      return logger.error(
        stripIndents`Target htmlhint already exists on project '${projectName}'!`
      );
    }
  } catch {
    return logger.error(
      stripIndents`Unable to find project '${projectName}' in current workspace. Please make sure project exists!`
    );
  }
  logger.info(
    stripIndents`Creating htmlhint target for project '${projectName}'...`
  );

  await initGenerator(tree, {
    projectName: withConfig ? projectName : null,
    skipFormat,
  });

  projectConfiguration.targets['htmlhint'] = {
    executor: '@wrckt/nx-htmlhint:lint',
    outputs: ['{options.outputFile}'],
    options: {
      config: !options.withConfig
        ? `{workspaceRoot}/${HTMLHINT_CONFIG}`
        : `{projectRoot}/${HTMLHINT_CONFIG}`,
      target: '{projcetRoot}/**/*',
    },
  };

  updateProjectConfiguration(
    tree,
    projectConfiguration.name,
    projectConfiguration
  );

  if (!options.skipFormat) {
    return await formatFiles(tree);
  }
};

export default configurationGenerator;

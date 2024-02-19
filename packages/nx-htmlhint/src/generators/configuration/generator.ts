import {
  formatFiles,
  GeneratorCallback,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  stripIndents,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { ConfigurationGeneratorSchema } from './schema';
import { HTMLHINT_CONFIG, HTMLHINT_TARGET_PATTERN } from '../../utils/utils';
import initGenerator from '../init/generator';
export const configurationGenerator = async (
  tree: Tree,
  options: ConfigurationGeneratorSchema
): Promise<GeneratorCallback> => {
  const { projectName, withProjectConfig, skipFormat } = options;
  const installTask = projectName
    ? initGenerator(tree, {
        projectName: withProjectConfig ? projectName : null,
        skipFormat,
      })
    : initGenerator(tree, { skipFormat });

  let projectConfiguration;
  try {
    projectConfiguration = readProjectConfiguration(tree, projectName);

    if (projectConfiguration?.targets?.['htmlhint']) {
      logger.error(
        stripIndents`Target htmlhint already exists on project '${projectName}'!`
      );
      throw new Error('Target htmlhint already exists');
    }
  } catch (error: any) {
    logger.error(
      stripIndents`Unable to find project '${projectName}' in current workspace. Please make sure project exists!`
    );
    throw error;
  }
  logger.info(
    stripIndents`Creating htmlhint target for project '${projectName}'...`
  );

  projectConfiguration.targets['htmlhint'] = {
    executor: '@wrckt/nx-htmlhint:lint',
    options: {
      config: joinPathFragments(
        withProjectConfig ? '{projectRoot}' : '{workspaceRoot}',
        HTMLHINT_CONFIG
      ),
      target: joinPathFragments('{projectRoot}', HTMLHINT_TARGET_PATTERN),
    },
  };

  updateProjectConfiguration(
    tree,
    projectConfiguration.name,
    projectConfiguration
  );

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return installTask;
};

export default configurationGenerator;

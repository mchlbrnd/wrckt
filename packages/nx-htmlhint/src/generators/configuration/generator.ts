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
): Promise<GeneratorCallback | void> => {
  const { projectName, withProjectConfig, skipFormat } = options;

  let projectConfiguration;
  try {
    projectConfiguration = readProjectConfiguration(tree, projectName);

    if (projectConfiguration?.targets?.['htmlhint']) {
      throw new Error(
        `Target htmlhint already exists on project '${projectName}'!`
      );
    }
  } catch (error: any) {
    logger.error(error.message);
    return Promise.resolve();
  }

  const installTask = projectName
    ? initGenerator(tree, {
        projectName: withProjectConfig ? projectName : null,
        skipFormat,
      })
    : initGenerator(tree, { skipFormat });

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

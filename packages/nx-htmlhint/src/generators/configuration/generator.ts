import {
  formatFiles,
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
) => {
  let projectConfiguration;
  const { projectName, withProjectConfig, skipFormat } = options;
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

  if (projectName) {
    await initGenerator(tree, {
      projectName: withProjectConfig ? projectName : null,
      skipFormat,
    });
  } else {
    await initGenerator(tree, { skipFormat });
  }

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
    return await formatFiles(tree);
  }
};

export default configurationGenerator;

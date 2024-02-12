import { LintExecutorSchema } from './schema';
import { spawn } from 'child_process';
import { join } from 'path';

const lintExecutor = (
  options: LintExecutorSchema
): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    const htmlhint = spawn('node', [
      join('node_modules', 'htmlhint', 'bin', 'htmlhint'),
      '--config',
      options.config,
      options.target,
    ]);

    htmlhint.stdout.pipe(process.stdout);
    htmlhint.stderr.pipe(process.stderr);

    htmlhint.on('close', (code: number) => {
      if (code === 0) {
        return resolve({ success: true });
      }
      return reject({ success: false });
    });
  });
};

export default lintExecutor;

import { spawn } from 'child_process';
import { cwd } from 'process';
import { LintExecutorSchema } from './schema';
import { resolve as pathResolve } from 'path';
import { platform } from 'os';

const lintExecutor = ({
  config,
  lintFilePattern,
  format,
  ignore,
  noColor,
  rules,
  rulesDir,
  warn,
}: LintExecutorSchema): Promise<{
  success: boolean;
  stdout: string;
  stderr: string;
}> => {
  return new Promise((resolve, reject) => {
    const htmlhint = spawn(
      pathResolve(
        'node_modules',
        '.bin',
        `htmlhint${platform() === 'win32' ? '.cmd' : ''}`
      ),
      [
        ...(config ? ['-c', config] : []),
        ...(format ? ['-f', format] : []),
        ...(ignore ? ['-i', ignore] : []),
        ...(noColor ? ['--nocolor'] : []),
        ...(rules ? ['-r', rules] : []),
        ...(rulesDir ? ['-R', rulesDir] : []),
        ...(warn ? ['--warn'] : []),
        lintFilePattern,
      ],
      {
        cwd: cwd(),
      }
    );

    htmlhint.stdout.pipe(process.stdout);
    htmlhint.stderr.pipe(process.stderr);

    let stdout = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    htmlhint.stdout.on('data', (chunk: any) => {
      stdout += chunk.toString();
    });

    let stderr = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    htmlhint.stderr.on('error', (chunk: any) => {
      stderr += chunk.toString();
    });

    htmlhint.on('close', (code: number) => {
      if (code === 0) {
        return resolve({ success: true, stdout, stderr });
      }
      return reject({ success: true, stdout, stderr });
    });
  });
};

export default lintExecutor;

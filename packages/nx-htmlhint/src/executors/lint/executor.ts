import { spawn } from 'child_process';
import { cwd } from 'process';
import { LintExecutorSchema } from './schema';
import path = require('path');

const lintExecutor = ({
  config,
  target,
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
      'node',
      [
        path.resolve('node_modules', 'htmlhint', 'bin', 'htmlhint'),
        ...(config ? ['-c', config] : []),
        ...(format ? ['-f', format] : []),
        ...(ignore ? ['-i', ignore] : []),
        ...(noColor ? ['--nocolor'] : []),
        ...(rules ? ['-r', rules] : []),
        ...(rulesDir ? ['-R', rulesDir] : []),
        ...(warn ? ['--warn'] : []),
        target,
      ],
      {
        cwd: cwd(),
      }
    );

    htmlhint.stdout.pipe(process.stdout);
    htmlhint.stderr.pipe(process.stderr);

    let stdout = '';
    htmlhint.stdout.on('data', (chunk: any) => {
      stdout += chunk.toString();
    });

    let stderr = '';
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

import { LintExecutorSchema } from './schema';
import executor from './executor';
import { join } from 'path';

const successOptions: LintExecutorSchema = {
  config: join(__dirname, '..', '..', 'test', '.htmlhintrc'),
  target: join(__dirname, '..', '..', 'test', 'success.html'),
  projectName: 'test-app',
};

const failOptions: LintExecutorSchema = {
  config: join(__dirname, '..', '..', 'test', '.htmlhintrc'),
  target: join(__dirname, '..', '..', 'test', 'fail.html'),
  projectName: 'test-app',
};

describe('lint executor', () => {
  it('should succeed', async () => {
    const output = await executor(successOptions);
    expect(output.success).toBe(true);
  });

  it('should fail', async () => {
    executor(failOptions).catch((output) => {
      expect(output.success).toBe(false);
    });
  });
});

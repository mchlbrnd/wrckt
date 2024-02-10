import { HtmlhintLintExecutorSchema } from './schema';
import executor from './executor';
import { join } from 'path';

const successOptions: HtmlhintLintExecutorSchema = {
  config: join(__dirname, '..', '..', 'test', '.htmlhintrc'),
  target: join(__dirname, '..', '..', 'test', 'success.html'),
  project: 'test-app',
};

const failOptions: HtmlhintLintExecutorSchema = {
  config: join(__dirname, '..', '..', 'test', '.htmlhintrc'),
  target: join(__dirname, '..', '..', 'test', 'fail.html'),
  project: 'test-app',
};

describe('Lint Executor', () => {
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

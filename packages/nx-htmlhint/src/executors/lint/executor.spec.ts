import { join } from 'path';
import { cwd } from 'process';
import { HTMLHINT_LINT_FILE_PATTERN } from '../../utils/utils';
import executor from './executor';

describe('lint executor', () => {
  it('should run on non-existing directory and succeed', async () => {
    const { success, stdout } = await executor({
      lintFilePattern: join(
        cwd(),
        'tmp',
        '___does_not_exist___',
        HTMLHINT_LINT_FILE_PATTERN
      ),
    });
    expect(success).toBe(true);
    expect(stdout).toMatch('Scanned 0 files, no errors found');
  });
});

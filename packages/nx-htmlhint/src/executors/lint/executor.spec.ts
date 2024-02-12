import { join } from 'path';
import { cwd } from 'process';
import { HTMLHINT_CONFIG, HTMLHINT_TARGET_PATTERN } from '../../utils/utils';
import executor from './executor';

describe('lint executor', () => {
  it('can run and fail', async () => {
    try {
      await executor({
        config: HTMLHINT_CONFIG,
        target: join(
          cwd(),
          'packackes',
          'nx-htmlhint',
          HTMLHINT_TARGET_PATTERN
        ),
        projectName: 'test-project',
      });
    } catch (e) {
      expect(e?.success).toBe(false);
    }
  });
});

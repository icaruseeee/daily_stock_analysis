// @vitest-environment node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Login page migrated to shared Apple-inspired design tokens.
// These tokens replace the old login-specific theme variables.
const REQUIRED_DESIGN_TOKENS = [
  '--primary',
  '--on-primary',
  '--body',
  '--ink-muted-48',
  '--canvas',
  '--canvas-parchment',
  '--hairline',
  '--status-success',
  '--status-warning',
  '--status-danger',
];

describe('login theme tokens', () => {
  it('defines shared design tokens used by the login page in the light theme root block', () => {
    const css = readFileSync(resolve(__dirname, '..', 'src', 'index.css'), 'utf8');
    const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);

    expect(rootMatch).not.toBeNull();
    const rootBlock = rootMatch?.[1] ?? '';

    for (const token of REQUIRED_DESIGN_TOKENS) {
      expect(rootBlock).toContain(token);
    }
  });

  it('defines shared design tokens used by the login page in the dark theme block', () => {
    const css = readFileSync(resolve(__dirname, '..', 'src', 'index.css'), 'utf8');
    const darkMatch = css.match(/\.dark\s*\{([\s\S]*?)\n\}/);

    expect(darkMatch).not.toBeNull();
    const darkBlock = darkMatch?.[1] ?? '';

    for (const token of REQUIRED_DESIGN_TOKENS) {
      expect(darkBlock).toContain(token);
    }
  });
});

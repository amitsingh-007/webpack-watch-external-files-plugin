import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import WebpackRunner from './webpack-runner';

const externalFile = 'tests/files/external-file.js';
const dummyFile = 'tests/files/dummy-file.js';
const testDistDir = 'tests/dist';

const touch = (path: string) => writeFileSync(path, readFileSync(path));
const distFileCount = () => readdirSync(testDistDir).length;

// Negative cases have no event to await, so they wait out a window in which a
// wrongly-watched file would have rebuilt. A rebuild of this fixture takes ~100ms.
const NO_REBUILD_WINDOW_MS = 1500;

const excludingGlob = ['tests/files/*.js', `!${dummyFile}`];

const cases: [
  name: string,
  files: string[] | null,
  changedFile: string,
  rebuilds: boolean,
][] = [
  [
    'no plugin: external file change does not rebuild',
    null,
    externalFile,
    false,
  ],
  ['no plugin: dummy file change does not rebuild', null, dummyFile, false],
  [
    'exact pattern: external file change rebuilds',
    [externalFile],
    externalFile,
    true,
  ],
  [
    'exact pattern: dummy file change does not rebuild',
    [externalFile],
    dummyFile,
    false,
  ],
  ['glob: external file change rebuilds', excludingGlob, externalFile, true],
  [
    'glob: ! excluded file change does not rebuild',
    excludingGlob,
    dummyFile,
    false,
  ],
];

describe('watch external files', () => {
  let runner: WebpackRunner;

  beforeEach(() => {
    rmSync(testDistDir, { recursive: true, force: true });
  });

  afterEach(async () => {
    await runner.cleanup();
  });

  it.each(cases)(
    '%s',
    async (_name, files, changedFile, rebuilds) => {
      runner = new WebpackRunner(files);
      await expect(runner.waitForEmit()).resolves.toBe(1);
      expect(distFileCount()).toBe(1);

      touch(changedFile);

      if (rebuilds) {
        await expect(runner.waitForEmit()).resolves.toBe(2);
        expect(distFileCount()).toBe(2);
      } else {
        await delay(NO_REBUILD_WINDOW_MS);
        expect(distFileCount()).toBe(1);
      }
    },
    30_000
  );
});

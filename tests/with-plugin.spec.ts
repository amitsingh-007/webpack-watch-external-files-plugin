import rimraf from "rimraf";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { dummyFile, externalFile, testDistDir } from "./constants/path";
import { getDirFilesCount, modifyExternalFileOnce } from "./helpers/file";
import { delay } from "./helpers/test";
import WebpackRunner from "./helpers/webpack-runner";

describe("with plugin", () => {
  let runner: WebpackRunner;
  beforeEach(() => {
    runner = new WebpackRunner(true);
    rimraf.sync(testDistDir);
  });

  afterEach(async () => {
    await runner.cleanup();
  });

  it("should run webpack again on external file change", async () => {
    await expect(runner.waitForEmit()).resolves.toBe(1);
    expect(getDirFilesCount(testDistDir)).toBe(1);
    modifyExternalFileOnce(externalFile);
    await expect(runner.waitForEmit()).resolves.toBe(2);
    expect(getDirFilesCount(testDistDir)).toBe(2);
  });

  it("should not run webpack again on dummy file change", async () => {
    await expect(runner.waitForEmit()).resolves.toBe(1);
    expect(getDirFilesCount(testDistDir)).toBe(1);
    modifyExternalFileOnce(dummyFile);
    await delay(1500);
    expect(getDirFilesCount(testDistDir)).toBe(1);
  });
});

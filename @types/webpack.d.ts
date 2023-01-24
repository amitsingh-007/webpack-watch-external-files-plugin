/**
 * This file contains changes required for webpack config in TS
 */

type Falsy = false | 0 | "" | null | undefined;

declare global {
  /**
   * @link https://github.com/microsoft/TypeScript/issues/16655#issuecomment-797044678
   */
  interface Array<T> {
    filter<S extends T>(
      predicate: BooleanConstructor,
      thisArg?: any
    ): Exclude<S, Falsy>[];
  }
}

export {};

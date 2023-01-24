import { Compiler } from 'webpack';

interface IOptions {
    files: string[];
}

declare class WatchExternalFilesPlugin {
    private files;
    constructor({ files }: IOptions);
    apply(compiler: Compiler): void;
}

export { WatchExternalFilesPlugin as default };

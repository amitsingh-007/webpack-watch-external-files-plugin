import fs from "fs";

export const modifyExternalFileOnce = (path: string) => {
  const data = fs.readFileSync(path);
  fs.writeFileSync(path, data);
};

export const getDirFilesCount = (path: string) => {
  const files = fs.readdirSync(path);
  return files.length;
};

import * as glob from 'glob';

export function findFileNamesFromGlob(globString: string) {
  return glob.sync(globString);
}

export function loadFromGlobString(globString: string) {
  const filePaths = findFileNamesFromGlob(globString);
  filePaths.map(fileName => require(fileName));
}

export function loadFromGlobArray(globs: string[]) {
  if (!globs.length) {
    throw new Error('globs is required!');
  }
  globs.forEach(globString => {
    if (typeof globString === 'string') {
      loadFromGlobString(globString);
    }
  });
  return undefined;
}

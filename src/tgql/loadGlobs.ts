import * as glob from 'glob';

export function findFileNamesFromGlob(globString: string) {
  return glob.sync(globString);
}

export function loadFromGlobString(globString: string) {
  const filePaths = findFileNamesFromGlob(globString);
  return filePaths.map(fileName => require(fileName));
}

export function loadFromGlobArray<T = any>(globs: string[]) {
  let results: T[] = [];
  if (!globs || !globs.length) {
    return [];
  }
  globs.forEach(globString => {
    if (typeof globString === 'string') {
      results = [...results, ...loadFromGlobString(globString)];
    }
  });
  return results;
}

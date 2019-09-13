import * as glob from 'glob';

export function findFileNamesFromGlob(globString: string) {
  return glob.sync(globString);
}

export function loadFromGlobString(globString: string) {
  const filePaths = findFileNamesFromGlob(globString);
  console.log('filePaths: ', filePaths);

  filePaths.map(fileName => require(fileName));
}

export function loadFromGlobArray(globs: string[]) {
  if (!globs.length) {
    throw new Error('globs is required!');
  }
  globs.forEach(globString => {
    if (typeof globString === 'string') {
      console.log('globString: ', globString);

      loadFromGlobString(globString);
    }
  });
  return undefined;
}

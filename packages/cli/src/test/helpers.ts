// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as pgtools from 'pgtools';
import * as util from 'util';

import { run } from '../cli';
import { Config, StringMap } from '../core';

export async function createDB(database: string) {
  const createDb = util.promisify(pgtools.createdb) as Function;
  return createDb(getPGConfig(), database);
}

export async function dropDB(database: string) {
  const dropDB = util.promisify(pgtools.dropdb) as Function;
  return dropDB(getPGConfig(), database);
}

export function spyOnStd() {
  const spy: {
    // TODO: for some reason, cli commands are not writing to stderr
    clear: () => void;
    stderr: jest.SpyInstance;
    stdout: jest.SpyInstance;
    getStdErr: Function;
    getStdOut: Function;
    getStdOutErr: Function;
  } = {
    clear: undefined as any,
    stderr: undefined as any,
    stdout: undefined as any,
    getStdErr: undefined as any,
    getStdOut: undefined as any,
    getStdOutErr: undefined as any
  };

  beforeAll(() => {
    spy.stderr = jest.spyOn(process.stderr, 'write');
    spy.stdout = jest.spyOn(process.stdout, 'write');
  });

  beforeEach(() => {
    spy.stderr.mockClear();
    spy.stdout.mockClear();
  });

  afterAll(() => {
    spy.stderr.mockRestore();
    spy.stdout.mockRestore();
  });

  spy.clear = () => {
    spy.stderr.mockClear();
    spy.stdout.mockClear();
  };

  spy.getStdOut = () => {
    return spy.stdout.mock.calls.join(' ');
  };

  spy.getStdErr = () => {
    return spy.stderr.mock.calls.join(' ');
  };

  // Jest does some funny stdout, stderr redirection, so we need to check
  // if message were written to either.
  spy.getStdOutErr = () => {
    return [spy.getStdOut(), spy.getStdErr()].join(' ');
  };

  return spy;
}

// This function allows us to call the CLI from it's entry point, getting a good enough functional
// test, but also having these tests add to our code coverage (using `system.run` does not give credit)
export async function callWarthogCLI(cmd: string, overrideEnvVars?: StringMap) {
  const oldArgv = process.argv;

  if (overrideEnvVars) {
    for (const key in overrideEnvVars) {
      process.env[key] = overrideEnvVars[key];
    }
  }

  // Gluegun requires the command come in as the 3rd+ arguments
  // Could pass empty strings in the first 2 elements, but the node and warthog commands
  // are what are passed in when you call from the command line
  process.argv = ['/fake/path/to/node', '/fake/path/to/warthog', ...cmd.split(' ')];

  try {
    await run(process.argv);
  } catch (error) {
    console.error('Error', error);
  }

  process.argv = oldArgv; // eslint-disable-line
  return;
}

function getPGConfig() {
  const config = new Config();

  return {
    host: config.get('DB_HOST'),
    user: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    port: config.get('DB_PORT')
  };
}

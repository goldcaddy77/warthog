import { run } from '../src/cli/cli';

export function spyOnStdOut() {
  const spy: { stdout: jest.SpyInstance; getStdOut: Function } = {
    stdout: undefined as any,
    getStdOut: undefined as any
  };

  beforeAll(() => {
    spy.stdout = jest.spyOn(process.stdout, 'write');
  });

  beforeEach(() => {
    spy.stdout.mockClear();
  });

  afterAll(() => {
    spy.stdout.mockRestore();
  });

  spy.getStdOut = () => {
    return spy.stdout.mock.calls.join(' ');
  };

  return spy;
}

// This function allows us to call the CLI from it's entry point, getting a good enough functional
// test, but also having these tests add to our code coverage (using `system.run` does not give credit)
export async function callWarthogCLI(cmd: string) {
  const oldArgv = process.argv;
  // Gluegun requires the command come in as the 3rd+ arguments
  // Could pass empty strings in the first 2 elements, but the node and warthog commands
  // are what are passed in when you call from the command line
  process.argv = ['/fake/path/to/node', '/fake/path/to/warthog', ...cmd.split(' ')];
  await run(process.argv);
  process.argv = oldArgv;
}

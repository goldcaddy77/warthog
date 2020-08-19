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
    spy.stderr = jest.spyOn(process.stderr, 'write').mockImplementation(() => false);
    spy.stdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => false);
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

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

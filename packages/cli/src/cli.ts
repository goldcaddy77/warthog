import { build } from 'gluegun';

/**
 * Create the cli and kick it off
 */
export async function run(argv: string[]) {
  // create a CLI runtime
  const cli = build()
    .brand('warthog')
    .src(__dirname)
    // .plugins('./node_modules', { matching: 'warthog-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .create();

  // and run it
  const toolbox = await cli.run(argv);

  // send it back (for testing, mostly)
  return toolbox;
}

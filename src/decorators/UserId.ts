import { createParamDecorator } from 'type-graphql'; // TODO: need to NestJS'ify this

export function UserId(): ParameterDecorator {
  return createParamDecorator(({ context }: { context: { user?: { id?: string } } }) => {
    if (!context.user) {
      throw new Error('`user` attribute not found on context');
    }
    if (!context.user.id) {
      throw new Error('`user` attribute does not contain an `id`');
    }
    return context.user.id;
  });
}

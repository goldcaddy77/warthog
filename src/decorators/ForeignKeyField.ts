import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

// Links two tables within the same DB, so they're joined by the ID columns
export function ForeignKeyField(): any {
  return composeMethodDecorators(
    Field(() => String),
    Column() as MethodDecoratorFactory
  );
}

// type-graphql is hooked into class-validator: https://github.com/typestack/class-validator
//              so we can have it automatically validate that args coming in are valid
// See https://github.com/typestack/class-validator#validation-decorators for list of decorators
// See https://github.com/typestack/class-validator/tree/master/sample for examples
import { Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @Min(0)
  offset?: number;

  @Field(() => Int, { nullable: true })
  @Min(1)
  limit?: number = 50;
}

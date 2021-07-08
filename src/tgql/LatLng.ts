import { Field, Float, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class LatLng {
  @Field(() => Float)
  latitude!: number; // TODO: string | number

  @Field(() => Float)
  longitude!: number; // TODO: string | number
}

@InputType()
export class LatLngInput {
  @Field(() => Float)
  latitude!: number; // TODO: string | number

  @Field(() => Float)
  longitude!: number; // TODO: string | number
}

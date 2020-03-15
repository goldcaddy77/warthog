import { BaseModel, IntField, Model, StringField } from '../../../../../src';

@Model()
export class Card extends BaseModel {
  @StringField()
  name!: string;

  @IntField({ nullable: true })
  nationalPokedexNumber?: number;

  @StringField({ nullable: true })
  types?: string;

  @StringField({ nullable: true })
  subtype?: string;

  @StringField({ nullable: true })
  supertype?: string;

  @StringField({ nullable: true })
  hp?: string;

  @StringField({ nullable: true })
  number?: string;

  @StringField({ nullable: true })
  artist?: string;

  @StringField({ nullable: true })
  rarity?: string;

  @StringField({ nullable: true })
  series?: string;

  @StringField({ nullable: true })
  set?: string;

  @StringField({ nullable: true })
  setCode?: string;

  @StringField({ nullable: true })
  retreatCost?: string;

  @StringField({ nullable: true })
  convertedRetreatCost?: string;

  @StringField({ nullable: true })
  text?: string;

  @StringField({ nullable: true })
  attackDamage?: string;

  @StringField({ nullable: true })
  attackCost?: string;

  @StringField({ nullable: true })
  attackName?: string;

  @StringField({ nullable: true })
  attackText?: string;

  @StringField({ nullable: true })
  weaknesses?: string;

  @StringField({ nullable: true })
  resistances?: string;

  @StringField({ nullable: true })
  ancientTrait?: string;

  @StringField({ nullable: true })
  abilityName?: string;

  @StringField({ nullable: true })
  abilityText?: string;

  @StringField({ nullable: true })
  abilityType?: string;

  @StringField({ nullable: true })
  evolvesFrom?: string;

  @StringField({ nullable: true })
  contains?: string;

  @StringField({ nullable: true })
  imageUrl?: string;

  @StringField({ nullable: true })
  imageUrlHiRes?: string;

  @StringField({ nullable: true })
  ability?: string;

  @StringField({ nullable: true })
  attacks?: string;
}

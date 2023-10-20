import {Entity, model, property, hasMany} from '@loopback/repository';
import {Material} from './material.model';
import {Reservation} from './reservation.model';
import {Income} from './income.model';

@model()
export class Provider extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  cuit: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @hasMany(() => Material, {through: {model: () => Reservation}})
  reservations: Material[];

  @hasMany(() => Material, {through: {model: () => Income}})
  incomes: Material[];

  constructor(data?: Partial<Provider>) {
    super(data);
  }
}

export interface ProviderRelations {
  // describe navigational properties here
}

export type ProviderWithRelations = Provider & ProviderRelations;

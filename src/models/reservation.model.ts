import {Entity, model, property} from '@loopback/repository';

@model({settings: {strictObjectIDCoercion: true}})
export class Reservation extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    default: () => new Date().toISOString(),
  })
  date: string;

  @property({
    type: 'string',
    default: () => new Date().toISOString(),
  })
  createdAt: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'string',
    required: true,
  })
  providerId: string;

  @property({
    type: 'string',
    required: true,
  })
  materialId: string;

  constructor(data?: Partial<Reservation>) {
    super(data);
  }
}

export interface ReservationRelations {
  // describe navigational properties here
}

export type ReservationWithRelations = Reservation & ReservationRelations;

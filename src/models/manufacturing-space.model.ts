import {Entity, model, property, hasMany} from '@loopback/repository';
import {SpaceReservation} from './space-reservation.model';

@model()
export class ManufacturingSpace extends Entity {
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
  address: Date;

  @property({
    type: 'string',
    required: true,
  })
  country: Date;

  @hasMany(() => SpaceReservation)
  spaceReservations: SpaceReservation[];

  constructor(data?: Partial<ManufacturingSpace>) {
    super(data);
  }
}

export interface ManufacturingSpaceRelations {
  // describe navigational properties here
}

export type ManufacturingSpaceWithRelations = ManufacturingSpace & ManufacturingSpaceRelations;

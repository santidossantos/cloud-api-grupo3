import {Entity, model, property} from '@loopback/repository';

@model()
export class SpaceReservation extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  dateFrom: string;

  @property({
    type: 'date',
    required: true,
  })
  dateTo: string;

  @property({
    type: 'string',
  })
  manufacturingSpaceId?: string;

  constructor(data?: Partial<SpaceReservation>) {
    super(data);
  }
}

export interface SpaceReservationRelations {
  // describe navigational properties here
}

export type SpaceReservationWithRelations = SpaceReservation & SpaceReservationRelations;

import {Entity, model, property} from '@loopback/repository';

@model()
export class Income extends Entity {
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

  constructor(data?: Partial<Income>) {
    super(data);
  }
}

export interface IncomeRelations {
  // describe navigational properties here
}

export type IncomeWithRelations = Income & IncomeRelations;

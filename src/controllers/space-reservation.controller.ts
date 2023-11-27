import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {SpaceReservation} from '../models';
import {SpaceReservationRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

//@authenticate('jwt')
export class SpaceReservationController {
  constructor(
    @repository(SpaceReservationRepository)
    public spaceReservationRepository: SpaceReservationRepository,
  ) {}

  @post('/space-reservations')
  @response(200, {
    description: 'SpaceReservation model instance',
    content: {
      'application/json': {
        schema: {
          items: getModelSchemaRef(SpaceReservation),
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SpaceReservation, {
            title: 'NewSpaceReservation',
            exclude: ['id'],
          }),
        },
      },
    })
    spaceReservation: Omit<SpaceReservation, 'id'>,
  ): Promise<SpaceReservation> {
    if (
      spaceReservation.dateFrom &&
      new Date(spaceReservation.dateFrom) < new Date()
    ) {
      throw new Error('Neither dateFrom or dateTo can be in the past');
    }
    if (
      spaceReservation.dateFrom &&
      new Date(spaceReservation.dateTo) < new Date()
    ) {
      throw new Error('Neither dateFrom or dateTo can be in the past');
    }
    if (!spaceReservation.manufacturingSpaceId) {
      throw new Error('Complete manufacturingSpaceId');
    }
    if (
      new Date(spaceReservation.dateTo) < new Date(spaceReservation.dateFrom)
    ) {
      throw new Error('dateTo must be after dateFrom');
    }

    const params = {
      manufacturingSpaceId: spaceReservation.manufacturingSpaceId,
      dateFrom: spaceReservation.dateFrom,
      dateTo: spaceReservation.dateTo,
    };

    const available =
      this.spaceReservationRepository.findBySpaceAndDates(params);

    if ((await available).length > 0) {
      throw new Error(
        'Could not create reservation. Manufacturing space will be occupied',
      );
    }
    return this.spaceReservationRepository.create(spaceReservation);
  }

  @get('/space-reservations/count')
  @response(200, {
    description: 'SpaceReservation model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SpaceReservation) where?: Where<SpaceReservation>,
  ): Promise<Count> {
    return this.spaceReservationRepository.count(where);
  }

  @get('/space-reservations')
  @response(200, {
    description: 'Array of SpaceReservation model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SpaceReservation, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SpaceReservation) filter?: Filter<SpaceReservation>,
  ): Promise<SpaceReservation[]> {
    return this.spaceReservationRepository.find(filter);
  }

  @get('/space-reservations/{id}')
  @response(200, {
    description: 'SpaceReservation model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SpaceReservation, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SpaceReservation, {exclude: 'where'})
    filter?: FilterExcludingWhere<SpaceReservation>,
  ): Promise<SpaceReservation> {
    return this.spaceReservationRepository.findById(id, filter);
  }

  @del('/space-reservations/{id}')
  @response(204, {
    description: 'SpaceReservation DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.spaceReservationRepository.deleteById(id);
  }
}

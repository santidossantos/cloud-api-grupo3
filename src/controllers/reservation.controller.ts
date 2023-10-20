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
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Reservation} from '../models';
import {ProviderRepository, ReservationRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class ReservationController {
  constructor(
    @repository(ReservationRepository)
    public reservationRepository: ReservationRepository,
    @repository(ProviderRepository)
    public providerRepository: ProviderRepository,
  ) {}

  @post('/reservations')
  @response(200, {
    description: 'Reservation model instance',
    content: {'application/json': {schema: getModelSchemaRef(Reservation)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {
            title: 'NewReservation',
            exclude: ['id', 'createdAt'],
          }),
        },
      },
    })
    reservation: Omit<Reservation, 'id'>,
  ): Promise<Reservation> {
    if (reservation.date && new Date(reservation.date) < new Date())
      throw new Error('Date cannot be in the past');

    const availableProviders =
      await this.providerRepository.findByMaterialAndDate(reservation);
    if (!availableProviders.some(p => p.id === reservation.providerId))
      throw new Error('The provider is not available for this date');

    return this.reservationRepository.create(reservation);
  }

  @get('/reservations/count')
  @response(200, {
    description: 'Reservation model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Reservation) where?: Where<Reservation>,
  ): Promise<Count> {
    return this.reservationRepository.count(where);
  }

  @get('/reservations')
  @response(200, {
    description: 'Array of Reservation model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Reservation, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Reservation) filter?: Filter<Reservation>,
  ): Promise<Reservation[]> {
    return this.reservationRepository.find(filter);
  }

  /*@patch('/reservations')
  @response(200, {
    description: 'Reservation PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {partial: true}),
        },
      },
    })
    reservation: Reservation,
    @param.where(Reservation) where?: Where<Reservation>,
  ): Promise<Count> {
    return this.reservationRepository.updateAll(reservation, where);
  }*/

  @get('/reservations/{id}')
  @response(200, {
    description: 'Reservation model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Reservation, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Reservation, {exclude: 'where'})
    filter?: FilterExcludingWhere<Reservation>,
  ): Promise<Reservation> {
    return this.reservationRepository.findById(id, filter);
  }

  /*@patch('/reservations/{id}')
  @response(204, {
    description: 'Reservation PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {partial: true}),
        },
      },
    })
    reservation: Reservation,
  ): Promise<void> {
    await this.reservationRepository.updateById(id, reservation);
  }

  @put('/reservations/{id}')
  @response(204, {
    description: 'Reservation PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() reservation: Reservation,
  ): Promise<void> {
    await this.reservationRepository.replaceById(id, reservation);
  }*/

  @del('/reservations/{id}')
  @response(204, {
    description: 'Reservation DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.reservationRepository.deleteById(id);
  }
}

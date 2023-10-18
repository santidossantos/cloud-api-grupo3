import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Provider,
Reservation,
Material,
} from '../models';
import {ProviderRepository} from '../repositories';

export class ProviderMaterialController {
  constructor(
    @repository(ProviderRepository) protected providerRepository: ProviderRepository,
  ) { }

  @get('/providers/{id}/materials', {
    responses: {
      '200': {
        description: 'Array of Provider has many Material through Reservation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Material)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Material>,
  ): Promise<Material[]> {
    return this.providerRepository.reservations(id).find(filter);
  }

  @post('/providers/{id}/materials', {
    responses: {
      '200': {
        description: 'create a Material model instance',
        content: {'application/json': {schema: getModelSchemaRef(Material)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Provider.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Material, {
            title: 'NewMaterialInProvider',
            exclude: ['id'],
          }),
        },
      },
    }) material: Omit<Material, 'id'>,
  ): Promise<Material> {
    return this.providerRepository.reservations(id).create(material);
  }

  @patch('/providers/{id}/materials', {
    responses: {
      '200': {
        description: 'Provider.Material PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Material, {partial: true}),
        },
      },
    })
    material: Partial<Material>,
    @param.query.object('where', getWhereSchemaFor(Material)) where?: Where<Material>,
  ): Promise<Count> {
    return this.providerRepository.reservations(id).patch(material, where);
  }

  @del('/providers/{id}/materials', {
    responses: {
      '200': {
        description: 'Provider.Material DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Material)) where?: Where<Material>,
  ): Promise<Count> {
    return this.providerRepository.reservations(id).delete(where);
  }
}

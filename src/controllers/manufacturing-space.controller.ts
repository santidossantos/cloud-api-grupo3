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
import {ManufacturingSpace} from '../models';
import {ManufacturingSpaceRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';

@authenticate('jwt')
export class ManufacturingSpaceController {
  constructor(
    @repository(ManufacturingSpaceRepository)
    public manufacturingSpaceRepository : ManufacturingSpaceRepository,
  ) {}

  @post('/manufacturing-spaces')
  @response(200, {
    description: 'ManufacturingSpace model instance',
    content: {'application/json': {schema: getModelSchemaRef(ManufacturingSpace)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ManufacturingSpace, {
            title: 'NewManufacturingSpace',
            exclude: ['id'],
          }),
        },
      },
    })
    manufacturingSpace: Omit<ManufacturingSpace, 'id'>,
  ): Promise<ManufacturingSpace> {
    return this.manufacturingSpaceRepository.create(manufacturingSpace);
  }

  @get('/manufacturing-spaces/count')
  @response(200, {
    description: 'ManufacturingSpace model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ManufacturingSpace) where?: Where<ManufacturingSpace>,
  ): Promise<Count> {
    return this.manufacturingSpaceRepository.count(where);
  }

  @get('/manufacturing-spaces')
  @response(200, {
    description: 'Array of ManufacturingSpace model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ManufacturingSpace, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ManufacturingSpace) filter?: Filter<ManufacturingSpace>,
  ): Promise<ManufacturingSpace[]> {
    return this.manufacturingSpaceRepository.find(filter);
  }

  @get('/manufacturing-spaces/{id}')
  @response(200, {
    description: 'ManufacturingSpace model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ManufacturingSpace, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ManufacturingSpace, {exclude: 'where'}) filter?: FilterExcludingWhere<ManufacturingSpace>
  ): Promise<ManufacturingSpace> {
    return this.manufacturingSpaceRepository.findById(id, filter);
  }

  @del('/manufacturing-spaces/{id}')
  @response(204, {
    description: 'ManufacturingSpace DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.manufacturingSpaceRepository.deleteById(id);
  }
  
  @post('/manufacturing-spaces/is-available')
  @response(200, {
    description: 'Manufacturing space is/is not available',
    content: {
      'application/json': {
        schema: {
          ok:'boolean',
          message:'string'
        }
      }
    }
  })
  async isAvailable(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              manufacturingSpaceId: {type: 'string'},
              dateFrom: {type: 'string'},
              dateTo: {type: 'string'},
            }
          }
        }
      }
    })
    params: {
      manufacturingSpaceId: string;
      dateFrom: string;
      dateTo: string;
    }
  ) {    
    const {manufacturingSpaceId, dateFrom, dateTo} = params;

    if (dateFrom && new Date(dateFrom) < new Date()) {
      throw new Error('Neither dateFrom or dateTo can be in the past'); }
    if (dateFrom && new Date(dateTo) < new Date()) {
      throw new Error('Neither dateFrom or dateTo can be in the past');}
    if (! manufacturingSpaceId){
      throw new Error('Complete manufacturingSpaceId');} 
    if (new Date(dateTo) < new Date(dateFrom)) {
      throw new Error('dateTo must be after dateFrom') }

    let manufacturingSpace = await this.manufacturingSpaceRepository.checkAvailability({manufacturingSpaceId: manufacturingSpaceId, dateFrom: dateFrom, dateTo: dateTo});
    console.log(manufacturingSpace)
    if (manufacturingSpace) {
      return { ok: 'true', message: 'Manufacturing space is available on selected dates' }
    }
    else {
      return { ok: 'false', message: 'Manufacturing space will not be available' }
    }
  }


}

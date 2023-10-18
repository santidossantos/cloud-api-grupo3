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
import {Income} from '../models';
import {IncomeRepository} from '../repositories';

export class IncomeController {
  constructor(
    @repository(IncomeRepository)
    public incomeRepository : IncomeRepository,
  ) {}

  @post('/incomes')
  @response(200, {
    description: 'Income model instance',
    content: {'application/json': {schema: getModelSchemaRef(Income)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Income, {
            title: 'NewIncome',
            exclude: ['id'],
          }),
        },
      },
    })
    income: Omit<Income, 'id'>,
  ): Promise<Income> {
    return this.incomeRepository.create(income);
  }

  @get('/incomes/count')
  @response(200, {
    description: 'Income model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Income) where?: Where<Income>,
  ): Promise<Count> {
    return this.incomeRepository.count(where);
  }

  @get('/incomes')
  @response(200, {
    description: 'Array of Income model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Income, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Income) filter?: Filter<Income>,
  ): Promise<Income[]> {
    return this.incomeRepository.find(filter);
  }

  @patch('/incomes')
  @response(200, {
    description: 'Income PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Income, {partial: true}),
        },
      },
    })
    income: Income,
    @param.where(Income) where?: Where<Income>,
  ): Promise<Count> {
    return this.incomeRepository.updateAll(income, where);
  }

  @get('/incomes/{id}')
  @response(200, {
    description: 'Income model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Income, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Income, {exclude: 'where'}) filter?: FilterExcludingWhere<Income>
  ): Promise<Income> {
    return this.incomeRepository.findById(id, filter);
  }

  @patch('/incomes/{id}')
  @response(204, {
    description: 'Income PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Income, {partial: true}),
        },
      },
    })
    income: Income,
  ): Promise<void> {
    await this.incomeRepository.updateById(id, income);
  }

  @put('/incomes/{id}')
  @response(204, {
    description: 'Income PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() income: Income,
  ): Promise<void> {
    await this.incomeRepository.replaceById(id, income);
  }

  @del('/incomes/{id}')
  @response(204, {
    description: 'Income DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.incomeRepository.deleteById(id);
  }
}

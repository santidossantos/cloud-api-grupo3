import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Income, IncomeRelations} from '../models';

export class IncomeRepository extends DefaultCrudRepository<
  Income,
  typeof Income.prototype.id,
  IncomeRelations
> {
  constructor(@inject('datasources.Mongo') dataSource: MongoDataSource) {
    super(Income, dataSource);
  }
}

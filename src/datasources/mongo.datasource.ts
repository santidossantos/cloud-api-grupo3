import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'atlas',
  connector: 'mongodb',
  port: 27017,
  url: `mongodb+srv://grupo3:grupo3@dssd-cluster.jqzshdn.mongodb.net/grupo3?retryWrites=true&w=majority`,
  useNewUrlParser: true,
};


@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Mongo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Mongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

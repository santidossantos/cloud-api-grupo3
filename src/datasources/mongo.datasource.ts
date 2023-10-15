import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {config as dotEnvConfig} from 'dotenv';

dotEnvConfig();

const config = {
  name: 'Mongo',
  url: process.env.MONGO_URL,
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

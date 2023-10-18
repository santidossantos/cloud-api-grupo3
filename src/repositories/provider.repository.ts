import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Provider, ProviderRelations, Material, Reservation} from '../models';
import {ReservationRepository} from './reservation.repository';
import {MaterialRepository} from './material.repository';

export class ProviderRepository extends DefaultCrudRepository<
  Provider,
  typeof Provider.prototype.id,
  ProviderRelations
> {

  public readonly reservations: HasManyThroughRepositoryFactory<Material, typeof Material.prototype.id,
          Reservation,
          typeof Provider.prototype.id
        >;

  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource, @repository.getter('ReservationRepository') protected reservationRepositoryGetter: Getter<ReservationRepository>, @repository.getter('MaterialRepository') protected materialRepositoryGetter: Getter<MaterialRepository>,
  ) {
    super(Provider, dataSource);
    this.reservations = this.createHasManyThroughRepositoryFactoryFor('reservations', materialRepositoryGetter, reservationRepositoryGetter,);
    this.registerInclusionResolver('reservations', this.reservations.inclusionResolver);
  }
}

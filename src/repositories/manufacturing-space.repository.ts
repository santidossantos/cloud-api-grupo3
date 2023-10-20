import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {ManufacturingSpace, ManufacturingSpaceRelations, SpaceReservation} from '../models';
import {SpaceReservationRepository} from './space-reservation.repository';

export class ManufacturingSpaceRepository extends DefaultCrudRepository<
  ManufacturingSpace,
  typeof ManufacturingSpace.prototype.id,
  ManufacturingSpaceRelations
> {

  public readonly spaceReservations: HasManyRepositoryFactory<SpaceReservation, typeof ManufacturingSpace.prototype.id>;

  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource, @repository.getter('SpaceReservationRepository') protected spaceReservationRepositoryGetter: Getter<SpaceReservationRepository>,
  ) {
    super(ManufacturingSpace, dataSource);
    this.spaceReservations = this.createHasManyRepositoryFactoryFor('spaceReservations', spaceReservationRepositoryGetter,);
    this.registerInclusionResolver('spaceReservations', this.spaceReservations.inclusionResolver);
  }

  public async checkAvailability(params: {
    manufacturingSpaceId: string;
    dateFrom: string;
    dateTo: string
  }):Promise<boolean>{
    const findReservations = (await this.spaceReservationRepositoryGetter()).findBySpaceAndDates(params);
    
    if ((await findReservations).length == 0) {
      return true;
    }
    return false; // theres a reservation on the selected range of dates

    
  }



}

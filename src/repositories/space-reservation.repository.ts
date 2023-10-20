import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {SpaceReservation, SpaceReservationRelations} from '../models';

export class SpaceReservationRepository extends DefaultCrudRepository<
  SpaceReservation,
  typeof SpaceReservation.prototype.id,
  SpaceReservationRelations
> {
  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource,
  ) {
    super(SpaceReservation, dataSource);
  }

  public async findBySpaceAndDates(params: {
    manufacturingSpaceId: string;
    dateFrom: string;
    dateTo: string;
  }) {
    const {manufacturingSpaceId, dateFrom, dateTo} = params;
    const filter = {where: {
        manufacturingSpaceId: manufacturingSpaceId ,
        or: [
          { and: [{dateFrom: { lte: dateFrom }},{ dateTo: { gte: dateFrom }}] },
          { and: [{dateFrom: { lte: dateTo }}, {dateTo: { gte: dateTo }}] },
        ] }
    }
    return await this.find(filter);
  }
  

}

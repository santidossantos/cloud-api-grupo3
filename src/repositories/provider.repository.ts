import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyThroughRepositoryFactory,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {
  Provider,
  ProviderRelations,
  Material,
  Reservation,
  Income,
} from '../models';
import {ReservationRepository} from './reservation.repository';
import {MaterialRepository} from './material.repository';
import {IncomeRepository} from './income.repository';

export class ProviderRepository extends DefaultCrudRepository<
  Provider,
  typeof Provider.prototype.id,
  ProviderRelations
> {
  public readonly reservations: HasManyThroughRepositoryFactory<
    Material,
    typeof Material.prototype.id,
    Reservation,
    typeof Provider.prototype.id
  >;

  public readonly incomes: HasManyThroughRepositoryFactory<
    Material,
    typeof Material.prototype.id,
    Income,
    typeof Provider.prototype.id
  >;

  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource,
    @repository.getter('ReservationRepository')
    protected reservationRepositoryGetter: Getter<ReservationRepository>,
    @repository.getter('MaterialRepository')
    protected materialRepositoryGetter: Getter<MaterialRepository>,
    @repository.getter('IncomeRepository')
    protected incomeRepositoryGetter: Getter<IncomeRepository>,
  ) {
    super(Provider, dataSource);
    this.incomes = this.createHasManyThroughRepositoryFactoryFor(
      'incomes',
      materialRepositoryGetter,
      incomeRepositoryGetter,
    );
    this.registerInclusionResolver('incomes', this.incomes.inclusionResolver);
    this.reservations = this.createHasManyThroughRepositoryFactoryFor(
      'reservations',
      materialRepositoryGetter,
      reservationRepositoryGetter,
    );
    this.registerInclusionResolver(
      'reservations',
      this.reservations.inclusionResolver,
    );
  }

  public async findByMaterialAndDate(params: {
    materialId: string;
    quantity: number;
    date: string;
  }): Promise<Provider[]> {
    const {materialId, quantity, date} = params;
    let availableProviders: any[] = [];

    const providers = await this.find();
    for (const provider of providers) {
      const $match = {
        materialId: materialId,
        providerId: provider.id,
        date: {$lte: date},
      };
      const $group = {_id: null, quantity: {$sum: '$quantity'}};

      const quantityFromIncomes =
        (await (
          await (await this.incomeRepositoryGetter()).dataSource.connector
            ?.collection('Income')
            .aggregate([{$match}, {$group}])
            .toArray()
        ).at(0)?.quantity) || 0;

      const quantityFromReservations =
        (await (
          await (await this.reservationRepositoryGetter()).dataSource.connector
            ?.collection('Reservation')
            .aggregate([{$match}, {$group}])
            .toArray()
        ).at(0)?.quantity) || 0;

      if (quantityFromIncomes - quantityFromReservations >= quantity)
        availableProviders.push({
          ...provider,
          availableQuantity: quantityFromIncomes - quantityFromReservations,
        });
    }

    return availableProviders;
  }
}

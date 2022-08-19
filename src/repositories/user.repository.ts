import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Figure} from '../models';
import {FigureRepository} from './figure.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly figures: HasManyRepositoryFactory<Figure, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('FigureRepository') protected figureRepositoryGetter: Getter<FigureRepository>,
  ) {
    super(User, dataSource);
    this.figures = this.createHasManyRepositoryFactoryFor('figures', figureRepositoryGetter,);
    this.registerInclusionResolver('figures', this.figures.inclusionResolver);
  }
}

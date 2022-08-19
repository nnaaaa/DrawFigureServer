import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, post,
  requestBody
} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {
  Figure
} from '../models';
import {UserRepository} from '../repositories';

export class UserFigureController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @authenticate('jwt')
  @get('/users/figures', {
    responses: {
      '200': {
        description: 'Array of User has many Figure',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Figure)},
          },
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Figure[]> {

    return this.userRepository.figures(currentUser[securityId]).find();
  }

  @post('/users/figures', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Figure)}},
      },
    },
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Figure, {
            title: 'NewFigureInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) figure: Omit<Figure, 'id'>,
  ): Promise<Figure> {
    return this.userRepository.figures(currentUser[securityId]).create(figure);
  }

  // @patch('/users/{id}/figures', {
  //   responses: {
  //     '200': {
  //       description: 'User.Figure PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async patch(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Figure, {partial: true}),
  //       },
  //     },
  //   })
  //   figure: Partial<Figure>,
  //   @param.query.object('where', getWhereSchemaFor(Figure)) where?: Where<Figure>,
  // ): Promise<Count> {
  //   return this.userRepository.figures(id).patch(figure, where);
  // }

  // @del('/users/{id}/figures', {
  //   responses: {
  //     '200': {
  //       description: 'User.Figure DELETE success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async delete(
  //   @param.path.string('id') id: string,
  //   @param.query.object('where', getWhereSchemaFor(Figure)) where?: Where<Figure>,
  // ): Promise<Count> {
  //   return this.userRepository.figures(id).delete(where);
  // }
}

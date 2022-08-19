import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, patch, post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
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

    return this.userRepository.figures(currentUser[securityId]).find({fields: {userId: false}});
  }

  @authenticate('jwt')
  @post('/users/figures', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Figure)}},
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Figure, {
            title: 'NewFigureInUser',
            exclude: ['id'],
          }),
        },
      },
    })
    figure: Omit<Figure, 'id'>,
  ): Promise<Figure> {
    return this.userRepository.figures(currentUser[securityId]).create(figure);
  }

  @authenticate('jwt')
  @patch('/users/figures/{id}', {
    responses: {
      '200': {
        description: 'User.Figure PATCH success count',
        content: {'application/json': {schema: getModelSchemaRef(Figure)}},
      },
    },
  })
  async patch(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Figure, {
            title: 'EditFigureInUser',
          }),
        },
      },
    })
    figure: Figure,
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ) {
    this.userRepository.figures(currentUser[securityId]).patch(figure, {id})
    return 'Success'
  }
}

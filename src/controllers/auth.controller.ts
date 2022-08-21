
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getJsonSchemaRef, getModelSchemaRef, post, Request, requestBody, Response, response, RestBindings} from '@loopback/rest';
import {HasherBindings, TokenServiceBindings, UserServiceBindings} from '../utils/keys';
import {User} from '../models';
import * as _ from 'lodash';
import {Credentials, UserRepository} from '../repositories';
import {JWTService} from '../services/jwt-service';
import {MyUserService} from '../services/user-service';
import {validateCredentials} from '../services/validator-service';
import {CredentialsRequestBody} from '../types/credential-schema';
import {BcryptHasher} from '../services/hash-service';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import { AuthRoute } from '../utils/route';

export class AuthController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(HasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @repository(UserRepository)
    protected userRepository: UserRepository,


  ) { }

  @post(AuthRoute.Login)
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async login(
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ) {
    const user = await this.userService.verifyCredentials(credentials);

    const userProfile = this.userService.convertToUserProfile(user);

    const token = await this.jwtService.generateToken(userProfile);

    res.header('accessToken', token)

    return 'Success'
  }

  @post(AuthRoute.Register)
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async signup(
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    }) userDto: Omit<User, 'id'>,
  ){
    await validateCredentials(_.pick(userDto, ['email', 'password']), this.userRepository);
    userDto.password = await this.hasher.hashPassword(userDto.password);
    const user = await this.userRepository.create(userDto);

    const userProfile = this.userService.convertToUserProfile(user);

    const token = await this.jwtService.generateToken(userProfile);

    res.header('accessToken', token)
 
    return 'Success'
  }

  @authenticate('jwt')
  @get(AuthRoute.Me, {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User),
          },
        },
      },
    },
  })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(currentUser.id);
    return _.omit(user, 'password');
  }
}

import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from './models';
import {Credentials} from './repositories/user.repository';
import {Hasher} from './services/hash-service';
// import {PasswordHasher} from './services/hash.password';
// require('dotenv').config();

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwtshouldberandom';
  export const TOKEN_EXPIRES_IN_VALUE = '24h';
}
export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expiresIn',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.jwt.service',
  );
}

export namespace HasherBindings {
  export const PASSWORD_HASHER =
    BindingKey.create<Hasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.rounds');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<
    UserService<Credentials, User>
  >('services.user.service');
}

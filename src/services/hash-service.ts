import {inject} from '@loopback/core';
import {compare, genSalt, hash} from 'bcryptjs';
import {HasherBindings} from '../keys';

export interface Hasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>
}

export class BcryptHasher implements Hasher<string> {
  async comparePassword(providedPass: string, storedPass: string): Promise<boolean> {
    const matches = await compare(providedPass, storedPass);
    return matches;
  }

  @inject(HasherBindings.ROUNDS)
  public readonly rounds: number

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.rounds);
    return await hash(password, salt);
  }
}

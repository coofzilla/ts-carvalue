import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}
  // @Injectable()
  // export class UsersService {
  //   repo: Repository<User>;

  //   constructor(repo: Repository<User>) {
  //     this.repo = repo;
  //   }
  // }

  create(email: string, password: string) {
    const user = this.repo.create({
      email,
      password,
    });

    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ email });
  }
  //not using update method because built in update works with object
  //if not working with entity hooks won't be called
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('user not found');
    }
    console.log('original user', user);
    Object.assign(user, attrs);
    console.log('assigned', user);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('user not found');
    }
    return this.repo.remove(user);
  }
}

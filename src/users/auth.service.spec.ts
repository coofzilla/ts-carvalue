import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

it('can create an instance of auth service', async () => {
  //create fake copy of users service
  const fakeUsersService: Partial<UsersService> = {
    //only defined find/create because only ones used by auth serv
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      //as type assertion
      Promise.resolve({ id: 1, email, password } as User),
  };

  const module = await Test.createTestingModule({
    providers: [
      AuthService,
      //if ask f/value of provide, give value from useValue
      { provide: UsersService, useValue: fakeUsersService },
    ],
  }).compile();

  const service = module.get(AuthService);

  expect(service).toBeDefined();
});

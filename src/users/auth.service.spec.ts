import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create fake copy of users service
    fakeUsersService = {
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

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'email in use',
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('signup@123.com', 'mypassword'),
    ).rejects.toThrow('user not found');
  });

  //if pw resolved, signin pw, or message wrong, will throw correct error message
  //if all three correct, will resolve and "fail" test
  it('throws if an invalid pw is provided, async', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'a',
          password:
            '1b9984be05bb9e3d.84b015294bd71ee90e2ad1bd8215635fb67b9e4d80358421a4a78ea2a8013343',
        } as User,
      ]);
    //remove PASS to make "fail", all three would be correct
    await expect(service.signin('email', 'mypasswordPASS')).rejects.toThrow(
      'bad password',
    );
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'bbbb@b.com',
          password:
            '1b9984be05bb9e3d.84b015294bd71ee90e2ad1bd8215635fb67b9e4d80358421a4a78ea2a8013343',
        } as User,
      ]);
    const user = await service.signin('bbbb@b.com', 'mypassword');
    expect(user).toBeDefined();
  });
});

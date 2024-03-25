import { userEntityMock } from '../../user/mocks/user.mock';
import { LoginDto } from '../dtos/login.dto';

export const loginUserMock: LoginDto = {
  email: userEntityMock.email,
  password: 'abc',
};

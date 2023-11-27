import { ImgData } from '../types/img.data.js';

export type LoginUser = {
  userName: string;
  password: string;
};

export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  age: number;
  friends: User[];
  enemies: User[];
  avatar: ImgData;
};

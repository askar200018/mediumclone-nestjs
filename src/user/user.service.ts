import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { JWT_SECRET_KEY } from '@app/config';
import { UserResponse } from './types/user-response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  generateJWT(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET_KEY,
    );
  }

  buildUserRespons(user: UserEntity): UserResponse {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }
}

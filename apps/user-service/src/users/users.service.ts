import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterUserDto, UpdateUserDto } from '../common/dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(registerDto: RegisterUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = new User();
    user.email = registerDto.email;
    user.password = hashedPassword;
    user.firstName = registerDto.firstName;
    user.lastName = registerDto.lastName;
    user.phone = registerDto.phone || '';

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['addresses'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateDto);
    return this.usersRepository.save(user);
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const user = await this.findById(userId);
    const hashedToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    user.refreshToken = hashedToken;
    await this.usersRepository.save(user);
  }
}

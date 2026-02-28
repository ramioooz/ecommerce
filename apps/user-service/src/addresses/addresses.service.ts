import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from '../common/dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  async create(userId: string, createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressesRepository.create({
      ...createAddressDto,
      userId,
    });
    return this.addressesRepository.save(address);
  }

  async findAll(userId: string): Promise<Address[]> {
    return this.addressesRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Address> {
    const address = await this.addressesRepository.findOne({
      where: { id, userId },
    });
    
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    
    return address;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.addressesRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
  }
}

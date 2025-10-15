import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './entities/persona.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
  ) { }

  // Create
  async create(userId: number, createPersonaDto: CreatePersonaDto) {
    if (!createPersonaDto.personas_name?.trim()) {
      throw new BadRequestException({
        success: false,
        message: 'Persona name is required',
        data: {},
      });
    }

    // Check how many personas this user already has
    const existingPersonas = await this.personaRepository.count({
      where: { user_id: userId },
    });

    const persona = this.personaRepository.create({
      ...createPersonaDto,
      user_id: userId,
      isdefault: existingPersonas === 0, // first persona = true, else false
    });

    const savedPersona = await this.personaRepository.save(persona);

    return {
      success: true,
      message: 'Persona created successfully',
      data: savedPersona,
    };
  }

  // Get all
  async findAll(userId: number,) {
    const personas = await this.personaRepository.find({
      where: { user_id: userId },
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      message: 'Personas fetched successfully',
      data: personas,
    };
  }

  // Get one
  async findOne(id: number) {
    const persona = await this.personaRepository.findOne({ where: { id } });
    if (!persona)
      throw new NotFoundException({
        success: false,
        message: `Persona with ID ${id} not found`,
        data: {},
      });
    return {
      success: true,
      message: 'Persona fetched successfully',
      data: persona,
    };
  }

  // Update
  async update(id: number, updatePersonaDto: UpdatePersonaDto) {
    const persona = await this.findOne(id);

    if (updatePersonaDto.personas_name && !updatePersonaDto.personas_name.trim()) {
      throw new BadRequestException({
        success: false,
        message: 'Persona name cannot be empty',
        data: {},
      });
    }

    if (updatePersonaDto.isdefault) {
      await this.personaRepository
        .createQueryBuilder()
        .update()
        .set({ isdefault: false })
        .where("user_id = :userId", { userId: persona.data.user_id })
        .execute();

      persona.data.isdefault = true;
    }

    Object.assign(persona.data, updatePersonaDto);
    const updatedPersona = await this.personaRepository.save(persona.data);

    return {
      success: true,
      message: 'Persona updated successfully',
      data: updatedPersona,
    };
  }


  // Delete
  async remove(id: number) {
    const result = await this.personaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException({
        success: false,
        message: `Persona with ID ${id} not found`,
        data: {},
      });
    }
    return {
      success: true,
      message: 'Persona deleted successfully',
      data: {},
    };
  }
}

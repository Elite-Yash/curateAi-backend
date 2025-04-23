import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCrmDto } from './dto/create-crm.dto';
import { UpdateCrmDto } from './dto/update-crm.dto';
import { Crm } from './entities/crm.entity';
import axios from 'axios';
import { addToCRM } from './dto/add-to-crm.dto';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(Crm)
    private readonly crmRepository: Repository<Crm>,
  ) {}
  async create(createCrmDto: CreateCrmDto) {
    const crm = this.crmRepository.create(createCrmDto);

    await this.crmRepository.save(crm);

    if (createCrmDto && createCrmDto?.crm_name === 'zendesk') {
      const status: any = await this.fetchZendeskConnectionStatus(createCrmDto);
      if (status == 200) {
        return { message: 'Connected Successfully' };
      }
    }
    return "We didn't identy CRM Properly.";
  }

  async addToZenDeskCRMService(addTOCRMDto: addToCRM) {
    try {
      const response = await axios.post(
        addTOCRMDto?.crm_url,
        {
          // Replace with the actual payload required by Zendesk Sell
          data: {
            first_name: addTOCRMDto?.name, // or split name into first/last name
            email: addTOCRMDto?.email,
            title: addTOCRMDto?.title,
            industry: addTOCRMDto?.industry,
            last_name: 'Unknown',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${addTOCRMDto.token}`, // Or wherever your access token is stored
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      if (response?.status === 200 && response?.statusText === 'OK') {
        return { message: 'Profile successfully added to CRM.' };
      }
    } catch (error) {
      return { message: error.response?.data || error.message };
    }
  }

  fetchZendeskConnectionStatus = async (createCrmDto: CreateCrmDto) => {
    try {
      const response = await axios.get(createCrmDto?.crm_url, {
        headers: {
          Authorization: `Bearer ${createCrmDto.token}`, // Or wherever your access token is stored
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return response?.status;
    } catch (error) {
      return error?.response?.status || error?.code || 'UNKNOWN_ERROR';
    }
  };
}

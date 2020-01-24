
import { Inject, Injectable } from '@nestjs/common';
import { Sheet } from './interfaces/sheet.interface';
import { UsersService } from '../users/users.service';
import { CreateDto } from './dto/sheet.dto';
import { formatMilliseconds, hoursToMilliseconds } from '@common/utils';
import { JWTDecryptedDto } from '@common/dto/jwt.dto';
import { Model } from 'mongoose';

@Injectable()
export class SheetsService {
  constructor(
    @Inject('SHEET_MODEL') private readonly sheetModel: Model<Sheet>,
    private readonly usersService: UsersService
  ) {}

  async create(createDto: CreateDto, userInfo: JWTDecryptedDto) {
    const { end, start, breaks: breaksCreateDto } = createDto;
    const user = await this.usersService.findById(userInfo.userId);

    let breaksDuration: number;
    const breaks = breaksCreateDto.map(breakItem => {
      const diffDate = breakItem.end.getTime() - breakItem.start.getTime();
      breakItem.duration = formatMilliseconds(diffDate);
      breaksDuration += diffDate;

      return breakItem;
    });

    const diffDate = end.getTime() - start.getTime();
    const diffHours = diffDate - breaksDuration;
    const totalHours = formatMilliseconds(diffHours);

    const milliRemaining = hoursToMilliseconds(user.hoursPerDay) - diffHours;
    const hoursRemaining = milliRemaining > 0 && formatMilliseconds(milliRemaining);

    const milliExtra = diffHours - hoursToMilliseconds(user.hoursPerDay);
    const hoursExtra = milliExtra > 0 && formatMilliseconds(milliExtra);

    const createdRoom = new this.sheetModel({
      ...createDto,
      breaks,
      totalHours,
      hoursRemaining,
      hoursExtra
    });

    await createdRoom.save();
  }
}

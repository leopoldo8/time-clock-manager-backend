import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateDto } from './dto/sheet.dto';
import { SheetsService } from './sheets.service';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetService: SheetsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/sheets')
  async create(@Body() create: CreateDto, @Request() req) {
    return this.sheetService.create(create, req.user);
  }
}

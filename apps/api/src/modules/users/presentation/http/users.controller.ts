import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from 'src/modules/auth/presentation/http/decorators/current-user.decorator';
import { UsersService } from 'src/modules/users/application/services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { RequiresPermissionsGuard } from './guards/requires-permissions.guard';

interface CurrentUserPayload {
  id: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RequiresPermissionsGuard)
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    return {
      data: UserResponseDto.fromDomain(user),
    };
  }

  @Get(':id')
  async getById(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('id') id: string,
  ) {
    this.assertSelf(currentUser, id);

    const user = await this.usersService.findById(id);

    return {
      data: UserResponseDto.fromDomain(user),
    };
  }

  @Patch(':id')
  async update(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    this.assertSelf(currentUser, id);

    const user = await this.usersService.updateProfile(id, { name: dto.name });

    return {
      data: user ? UserResponseDto.fromDomain(user) : null,
    };
  }

  @Patch(':id/status')
  @UseGuards(RequiresPermissionsGuard)
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeUserStatusDto,
  ) {
    const user = await this.usersService.changeStatus(id, dto.status);

    return {
      data: user ? UserResponseDto.fromDomain(user) : null,
    };
  }

  @Delete(':id')
  @UseGuards(RequiresPermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
  }

  private assertSelf(currentUser: CurrentUserPayload, id: string): void {
    if (currentUser.id !== id) {
      throw new ForbiddenException();
    }
  }
}

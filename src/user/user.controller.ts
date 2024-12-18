import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.create-dto';
import { UpdateUserDto } from './dto/user.update-dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { FindDto } from 'src/utils/find.dto';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { Role } from 'src/authorization/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Throttle({
    short: { limit: 1, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @Public()
  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Roles(Role.Admin)
  @Get()
  findAll(@Query() findDto: FindDto) {
    return this.userService.findAll(findDto);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto, req);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    if (req?.user?.id === +id) {
      throw new ForbiddenException('Cannot delete yourself!');
    }
    return this.userService.remove(+id);
  }
}

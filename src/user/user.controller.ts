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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.create-dto';
import { UpdateUserDto } from './dto/user.update-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { FindDto } from 'src/utils/find.dto';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { Role } from 'src/authorization/enums/role.enum';

@Controller('users')
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

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: string /*, @Request() req: any */) {
    // if (+id !== req.user?.id) {
    //   throw new ForbiddenException();
    // }
    return this.userService.findOneById(+id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() findDto: FindDto) {
    return this.userService.findAll(findDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (+id !== req.user?.id) {
      throw new ForbiddenException();
    }
    // console.log(req.user);
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    // if (+id === authUser.id) {
    //   throw new UnprocessableEntityException('Cannot deleted yourself');
    // }
    return this.userService.remove(+id);
  }
}

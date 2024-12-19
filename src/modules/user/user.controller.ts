import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
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
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { FindDto } from 'src/utils/find.dto';
import { Roles } from 'src/modules/role/decorators/roles.decorator';
import { Role } from 'src/modules/role/enums/role.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entity/user.entity';

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
  @ApiBody({ type: CreateUserDto })
  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserEntity,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Roles(Role.USER_MANAGER)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserEntity,
    isArray: true,
  })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiQuery({ name: 'offset', type: Number, required: true })
  findAll(@Query() findDto: FindDto) {
    return this.userService.findAll(findDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto, req);
  }

  @Roles(Role.USER_MANAGER)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  remove(@Request() req: any, @Param('id') id: string) {
    if (req?.user?.id === +id) {
      throw new ForbiddenException('Cannot delete yourself!');
    }
    return this.userService.remove(+id);
  }
}
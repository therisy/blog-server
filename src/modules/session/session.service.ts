import { UserService } from '@modules/user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateSessionDto } from './etc/create-session.dto';

@Injectable()
export class SessionService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async create(dto: CreateSessionDto) {
        const user = await this.userService.getByEmail(dto.email);
        if (!user) throw new NotFoundException('User not found')

        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) throw new NotFoundException('Password does not match');

        return this.jwtService.sign({
            id: user.id,
            username: user.username,
          });
    }
}

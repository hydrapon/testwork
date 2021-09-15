import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Table, Model } from 'sequelize-typescript';

interface UserCreateParams {
    email?: string;
    phone?: string;
    password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreateParams> {
    @ApiProperty({ example: 1, description: 'unique identifier' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'Petya', description: 'user name' })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ApiProperty({ example: 'emailLogin@example.com', description: 'user email' })
    @Column({ type: DataType.STRING, unique: true })
    email: string;

    @ApiProperty({ example: '79008887766', description: 'user phone' })
    @Column({ type: DataType.STRING, unique: true })
    phone: string;

    @ApiProperty({ example: 'Hard_123_PAssworD', description: 'user password' })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @ApiProperty({ example: '1', description: 'user role' })
    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
    role: number;
}
import {
  Model,
  Column,
  DataType,
  Table,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

interface UserCreationAttrs {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends Model<User, UserCreationAttrs> {

  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, field: 'first_name' })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'last_name' })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'password_hash' })
  passwordHash: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'profile_image_url' })
  profileImageUrl: string;

  @Column({ type: DataType.STRING, allowNull: false })
  role: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'phone_number' })
  phoneNumber?: string;
}

import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo
} from 'sequelize-typescript';
import { PropertyImage } from './property_images.model';
import { User } from 'src/user/user.model';

@Table({ tableName: 'properties', timestamps: false })
export class Property extends Model<Property> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id: number;

    @Column({ type: DataType.STRING, allowNull: true })
    title: string;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    price: number;

    @Column({ type: DataType.STRING, allowNull: false })
    address: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    bedrooms: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    bathrooms: number;

    @Column({ type: DataType.INTEGER, allowNull: true, field: 'year_built' })
    yearBuilt: number;

    @Column({ type: DataType.TEXT, allowNull: true })
    description: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false, field: 'agent_id' })
    agentId: number;
    @BelongsTo(() => User)
    agent: User;

    @HasMany(() => PropertyImage)
    images: PropertyImage[];
}

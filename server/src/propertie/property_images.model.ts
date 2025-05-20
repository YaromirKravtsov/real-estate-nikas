import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
    AutoIncrement
} from 'sequelize-typescript';
import { Property } from './property.model';

@Table({ tableName: 'property_images', timestamps: false })
export class PropertyImage extends Model<PropertyImage> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id: number;

    @ForeignKey(() => Property)
    @Column({ type: DataType.INTEGER, allowNull: false, field: 'property_id' })
    propertyId: number;

    @Column({ type: DataType.STRING, allowNull: false, field: 'image_url' })
    imageUrl: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false, field: 'is_main' })
    isMain: boolean;

    @BelongsTo(() => Property)
    property: Property;
}

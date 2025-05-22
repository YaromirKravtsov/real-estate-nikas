import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from 'sequelize-typescript';
import { Property } from 'src/propertie/property.model';

@Table({ tableName: 'property_requests', timestamps: false })
export class PropertyRequest extends Model<PropertyRequest> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => Property)
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyId: number;

  @BelongsTo(() => Property)
  property: Property;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  message: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  requestType: number; 
  // NOTE if requestType == 1 else  'request for view' 
  // if requestType == 2 else 'request for submission'
  
  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt: Date;
}

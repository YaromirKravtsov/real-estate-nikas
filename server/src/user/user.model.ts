
import {Model, Column, DataType, Table, HasMany, BelongsToMany } from "sequelize-typescript";



interface UserCreationAttrs{
    username: string;
    password?: string;
    role:string;
    phone?: string;
    email?:string;
    avatarLink:string;
}

@Table({tableName:'users',createdAt:false, updatedAt:false})
export class User extends Model<User,UserCreationAttrs>{

    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;
    
    @Column({type:DataType.STRING, allowNull:false, field: 'first_name'})
    firstName:string;

    @Column({type:DataType.STRING, allowNull:false, field: 'last_name'})
    lastName:string;

    @Column({ type: DataType.STRING, allowNull: true })
    phone: string;

    @Column({type:DataType.STRING, allowNull:true})
    email:string;
    
    @Column({type:DataType.STRING,  allowNull:true})
    password:string;

    @Column({type:DataType.STRING, allowNull:false})
    role:string;

    @Column({type:DataType.STRING, allowNull:true, field: 'avatarLing'})
    avatarLink:string;

}
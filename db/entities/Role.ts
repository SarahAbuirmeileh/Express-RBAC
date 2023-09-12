import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.js";
import { Permission } from "./Permission.js";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => User, user => user.roles)
    users: User[]

    @ManyToMany(() => Permission, permission => permission.roles)
    @JoinTable()
    permissions: Permission[] 

    @Column({
        type: 'enum',
        enum: ['admin', 'user', 'editor']
    })
    name: 'admin' | 'user' | 'editor';      

    @CreateDateColumn({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP(6)"
    })
    createdAt: Date;
}
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role.js";

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['create_post', 'edit_user', 'delete_comment']
  })
  status: 'create_post' | 'edit_user' | 'delete_comment';

  @ManyToMany(()=>Role, role=>role.permissions)
  roles:Role[]

  @CreateDateColumn({
    type: 'timestamp',
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt: Date;
}
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable:false, length:255})
  firstName:string

  @Column({nullable:false, length:255})
  lastName:string

  @Column({nullable:true})
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Accepted', 'Rejected'],
    default:"Pending"
  })
  status: 'Pending' | 'Accepted' | 'Rejected';

  @CreateDateColumn({
    type: 'timestamp',
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt: Date;
}
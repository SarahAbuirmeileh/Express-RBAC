import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import bcrypt from 'bcrypt';
import { Profile } from "./Profile.js";
import { Role } from "./Role.js";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 300, nullable: false })
  name: string

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
    }
  }
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @ManyToMany(() => Role, role => role.users, { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinTable()
  roles: Role[]

  @OneToOne(() => Profile, {cascade: true, onDelete:"CASCADE"})
  @JoinColumn()
  profile: Profile

  @Column({
    default: "user",
    type: 'enum',
    enum: ['admin', 'user', 'owner']
  })
  type: "admin" | "user" | "owner"

  @CreateDateColumn({
    type: 'timestamp',
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt: Date;
}
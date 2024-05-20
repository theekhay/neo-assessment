import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../models/abstract.entity';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, name: 'first_name' })
  firstName: string;

  @Column({ nullable: false, name: 'last_name' })
  lastName: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}

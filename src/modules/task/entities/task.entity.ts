import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../models/abstract.entity';

@Entity()
export class Task extends AbstractEntity<Task> {
  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false, default: false })
  completed: boolean;

  @Column()
  dueDate: Date;
}

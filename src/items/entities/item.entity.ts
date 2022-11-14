import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listitem } from '../../listitem/entities/listitem.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  name: string;

  @Column({ nullable: true })
  @Field( () => String, { nullable: true } )
  quantityUnits?: string;

  @ManyToOne( () => User, (user) => user.items, { nullable: false, lazy: true } )
  @Index('userId-index')
  @Field( () => User )
  user: User;

  @OneToMany( () => Listitem, ( listItem ) => listItem.list, { lazy: true } )
  @Field( () => [Listitem] )
  listItem: Listitem[]
} 

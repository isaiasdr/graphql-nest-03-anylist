import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listitem } from '../../listitem/entities/listitem.entity';

@Entity({ name: 'lists' })
@ObjectType()
export class List {

  @Field( () => ID )
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field( () => String )
  @Column({
    type: 'text',

  })
  name: string;

  //relacion index userId-index
  @ManyToOne( () => User, ( user ) => user.lists, { nullable: false, lazy: true } )
  @Index('userId-list-index')
  @Field( () => User )
  user: User;

  @OneToMany(() => Listitem, (listItem) => listItem.list, { lazy: true })
  @Field( () => [Listitem] )
  listItem: Listitem[];
}

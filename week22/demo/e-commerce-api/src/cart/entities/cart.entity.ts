import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.carts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true, eager: true })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get total(): number {
    return this.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  }

  get itemCount(): number {
    return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }
}

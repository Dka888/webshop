import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Cart, CartItem } from '../../models/Cart.model';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatBadge,
    MatMenuTrigger,
    MatMenu,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private _cart: Cart = {items: []};
  itemsQuantity = 0;

  constructor(private cartService: CartService) {}

  @Input() 
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;
    this.itemsQuantity = cart.items.map(item => item.quantity).reduce((acc, cur) => acc + cur, 0);
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart():void {
    this.cartService.clearCart();
  }

}

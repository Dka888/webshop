import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/Cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({items: []});

  constructor(private _snackBar: MatSnackBar) { }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);

    if(itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 })

  }

  getTotal(items: CartItem[]): number {
    return items.map(item => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0)
  }

  clearCart(): void {
    this.cart.next({ items: []});
    this._snackBar.open('The cart is clear', 'Ok', { duration: 3000 })
  }

  deleteProduct(item: CartItem): void {
    const items = [...this.cart.value.items];
    const filteredItems = items.filter(_item => _item.id !== item.id);
    this.cart.next({ items: filteredItems });
    this._snackBar.open('The Item is removed.', 'Ok', { duration: 3000 });
  }

  onRemoveQuantity(item: CartItem): void {
    const { items } = this.cart.value;
    const newItems = items.map(itemCart => { 
      if(itemCart.id === item.id) {
        const newQuantity = itemCart.quantity - 1;
         return  {...itemCart, quantity: newQuantity}
      } 
      return itemCart;
    }).filter(item => !!item.quantity);

    this.cart.next({items: newItems});
    this._snackBar.open('The product is removed', 'Ok', {duration: 3000})
    
  }
}
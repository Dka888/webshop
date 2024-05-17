import { Component, OnInit, inject } from '@angular/core';
import { Cart, CartItem } from '../../models/Cart.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: Cart = {items: [{
    product: 'https://via.placeholder.com/150',
    name: 'shoes',
    price: 159,
    quantity: 2,
    id: 1,
  }]};

  http = inject(HttpClient);

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [ 
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ]

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    })
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }
  
  onClearCart(): void {
    this.cartService.clearCart();
  }

  onClearRow(item: CartItem): void {
    this.cartService.deleteProduct(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.onRemoveQuantity(item);
  }

  onCheckout(): void {
    this.http.post('https://server-webshop-ftrij7jzp-dka888s-projects.vercel.app/checkout', {
      items: this.cart.items
    }
    ).subscribe(async(res: any) => {
      let stripe = await loadStripe('pk_test_51PGmY700ssKgyPkdtWuVZc5kaRkg6P1E4sG5s6NbNytrxTPrbOs10DIF7LhZCUeMuuqtorZt2wXQtR2phggovFJX00EFD6SL39');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    })
  }
}

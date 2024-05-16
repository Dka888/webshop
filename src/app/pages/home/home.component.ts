import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProductsHeaderComponent } from "./components/products-header/products-header.component";
import { FiltersComponent } from './components/filters/filters.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { ProductBoxComponent } from './components/product-box/product-box.component';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/Product.model';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

const ROW_HEIGHT: {[id: number]: number} = {1: 400, 3: 335, 4: 350}
export const STORE_BASE_URL = 'https://fakestoreapi.com'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatSidenavModule,
    ProductsHeaderComponent,
    CommonModule,
    FiltersComponent,
    MatGridListModule,
    ProductBoxComponent,
    HttpClientModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private cartService: CartService) {}

  cols = 3;
  rowHeight = ROW_HEIGHT[this.cols];
  category: string | undefined;
  products: Product[] | undefined;
  sort='desc';
  count = 12; 
  httpClient = inject(HttpClient);
  productsSubscription: Subscription | undefined;

   ngOnInit(): void {

    this.getProducts(); 
  }

  getProducts(): void {
    this.productsSubscription = this.getAllProducts(this.count, this.sort, this.category).subscribe(_products => {
      this.products = _products;
    })
  }

  getAllProducts(limit = 12, sort='desc', category?: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${STORE_BASE_URL}/products${ category ? '/category/'+ category : ''}?sort=${sort}&limit=${limit}`
    )
  }

  onColumnsCountUpdate(countColumns: number): void {
    this.cols = countColumns;
  }

  onShowTitleCategory(changedCategory: string): void {
    this.category = changedCategory;
    this.getProducts()
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id
    })
  }

  onItemsCountChange(limit: number): void {
    this.count = limit;
    this.getProducts()
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts()
  }

  ngOnDestroy(): void {
    if(this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
}

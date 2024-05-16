import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule} from '@angular/material/list';
import { Observable, Subscription } from 'rxjs';
import { STORE_BASE_URL } from '../../home.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatListModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit, OnDestroy {

  http = inject(HttpClient);

  @Output() onChangeCategory = new EventEmitter<string>();

  categories: string[] | undefined;
  categoriesSubscription: Subscription | undefined;

  onShowCaterogy(category: string): void {
    this.onChangeCategory.emit(category);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${STORE_BASE_URL}/products/categories`)
  }
  
  ngOnInit(): void {
    this.categoriesSubscription = this.getAllCategories().subscribe(response => {
      this.categories = response
    });
  }

  ngOnDestroy(): void {
    if(this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}

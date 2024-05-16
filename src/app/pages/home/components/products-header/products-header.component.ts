import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-products-header',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
  ],
  templateUrl: './products-header.component.html',
  styleUrl: './products-header.component.css'
})
export class ProductsHeaderComponent {
  @Output() columnsCountChange = new EventEmitter<number>()
  @Output() sortChange = new EventEmitter<string>();
  @Output() countItem = new EventEmitter<number>();

  sort='desc';
  itemsShowCount = 12;

  onSortUpdated(newSort: string): void {
    this.sort = newSort;
    this.sortChange.emit(newSort);
  }

  onChangeItemsShowCount(showCount: number): void {
    this.itemsShowCount = showCount;
    this.countItem.emit(showCount);
  }

  onColumnsUpdate(count: number): void {
    this.columnsCountChange.emit(count);
  }

}

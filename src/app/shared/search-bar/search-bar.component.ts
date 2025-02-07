import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search-bar.component.html',
})
export class SearchComponent {
    @Output() searchEvent = new EventEmitter<string>();

    onSearch(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      this.searchEvent.emit(inputElement.value);
    }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./notification.component.html`,
  styles: [`
    .translate-x-full {
      transform: translateX(100%);
    }
  `]
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {}
}

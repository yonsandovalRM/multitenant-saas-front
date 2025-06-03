import { Component, signal } from '@angular/core';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item.component';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItemComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isOpen = signal(true);

  toggleSidebar() {
    this.isOpen.update((prev) => !prev);
  }
}

import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-item.component.html',
})
export class SidebarItemComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() isOpen = true;
  @Input() routerLink = '/';
}

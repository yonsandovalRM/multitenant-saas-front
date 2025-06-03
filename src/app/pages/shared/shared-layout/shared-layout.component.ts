import { Component, effect, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shared-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './shared-layout.component.html',
  styleUrls: ['./shared-layout.component.css'],
})
export class SharedLayoutComponent {
  // Usamos una signal para el estado del scroll
  scrolled = signal(false);

  constructor() {
    // Usamos `effect` para manejar el scroll reactivamente
    effect((onCleanup) => {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 10;
        this.scrolled.set(isScrolled);
      };

      // Escuchamos el evento scroll
      window.addEventListener('scroll', handleScroll);

      // Limpieza al destruir el componente
      onCleanup(() => {
        window.removeEventListener('scroll', handleScroll);
      });
    });
  }
}

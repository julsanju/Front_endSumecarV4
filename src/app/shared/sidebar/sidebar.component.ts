import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarClosed = false;
  darkMode = false;
  showSettings = false; // Variable para controlar la visualización de la configuración

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  toggleSettings() {
    this.showSettings = !this.showSettings; // Cambia el estado de la configuración al hacer clic
  }
}

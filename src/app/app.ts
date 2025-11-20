import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Registro } from "./auth/registro/registro";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Registro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sistema1_de1_tickets');
}

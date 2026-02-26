import { Component } from '@angular/core';
import { TripsComponent } from './trips/trips.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TripsComponent],
  templateUrl: './app.html'
})
export class AppComponent {}
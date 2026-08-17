import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {

  report: any[] = [];
  loading = true;
  error = '';

  constructor(private tripService: TripService) {}

  ngOnInit() {
    this.tripService.getResortReport().subscribe({
      next: data => {
        this.report = data || [];
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Unable to load report.';
        this.loading = false;
      }
    });
  }
}
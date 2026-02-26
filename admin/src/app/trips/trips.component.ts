import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../services/trip.service';
import { TripCardComponent } from './trip-card/trip-card.component';
import { TripEdit } from '../trip-edit/trip-edit.component';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, TripCardComponent, TripEdit],
  templateUrl: './trips.component.html'
})
export class TripsComponent implements OnInit {

  trips:any[] = [];
  selectedTrip:any = null;
  showEdit:boolean = false;

  constructor(
    private tripService:TripService,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit(){
    this.loadTrips();
  }

  loadTrips(){
    this.tripService.getTrips().subscribe({
      next:data=>{
        console.log("API DATA:", data);
        this.trips = data || [];

        // FORCE UI refresh (critical fix)
        this.cdr.detectChanges();
      },
      error:err=>console.error(err)
    });
  }

  showAddForm(){
    this.selectedTrip = null;
    this.showEdit = true;
  }

  onEditTrip(trip:any){
    this.selectedTrip = trip;
    this.showEdit = true;
  }

  onTripSaved(){
    this.showEdit = false;
    this.loadTrips();
  }
}
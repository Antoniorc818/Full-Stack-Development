import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TripService } from '../services/trip.service';
import { TripCardComponent } from './trip-card/trip-card.component';
import { TripEdit } from '../trip-edit/trip-edit.component';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCardComponent, TripEdit],
  templateUrl: './trips.component.html'
})
export class TripsComponent implements OnInit {

  trips:any[] = [];
  selectedTrip:any = null;
  showEdit:boolean = false;
  searchQuery:string = '';

  // Search-as-you-type without firing a request on every keystroke:
  // debounce waits for a pause in typing, distinctUntilChanged skips
  // repeat queries (e.g. from focus/blur), and switchMap cancels any
  // in-flight request if a newer keystroke has already superseded it.
  private searchTerms = new Subject<string>();

  constructor(
    private tripService:TripService,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit(){
    this.searchTerms.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(query => this.tripService.searchTrips(query))
    ).subscribe({
      next: data => {
        this.trips = data || [];
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });

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

  onSearchChange(query: string){
    this.searchQuery = query;
    this.searchTerms.next(query);
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
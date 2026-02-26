import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../../services/trip.service';

@Component({
  selector:'app-trip-card',
  standalone:true,
  imports:[CommonModule],
  templateUrl:'./trip-card.component.html'
})
export class TripCardComponent {

  @Input() trip:any;

  @Output() edit = new EventEmitter<any>();
  @Output() deleted = new EventEmitter<void>();

  constructor(private tripService:TripService){}

  editTrip(){
    this.edit.emit(this.trip);
  }

  deleteTrip(){

    if(!confirm("Delete trip?")) return;

    this.tripService.deleteTrip(this.trip._id)
      .subscribe(()=>{
        this.deleted.emit();
      });
  }
}
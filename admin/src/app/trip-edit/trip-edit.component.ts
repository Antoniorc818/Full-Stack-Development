import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../services/trip.service';

@Component({
  selector:'app-trip-edit',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl:'./trip-edit.component.html'
})
export class TripEdit implements OnChanges {

  @Input() trip:any;
  @Output() tripSaved = new EventEmitter<void>();

  editTrip:any = {
    _id:'',
    name:'',
    description:'',
    price:'',
    length:''
  };

  constructor(private tripService:TripService){}

  ngOnChanges(){

    if(this.trip){
      this.editTrip = {...this.trip};
    }
    else{
      this.resetForm();
    }
  }

  /**
   * Reset form model
   */
  resetForm(){
    this.editTrip = {
      _id:'',
      name:'',
      description:'',
      price:'',
      length:''
    };
  }

  /**
   * Save trip (POST or PUT)
   */
  saveTrip(){

    // UPDATE existing trip
    if(this.editTrip._id){

      this.tripService.updateTrip(
        this.editTrip._id,
        this.editTrip
      ).subscribe({
        next:()=>{
          alert("Trip updated successfully");
          this.tripSaved.emit();
        },
        error:err=>console.error("Update error:", err)
      });

    }
    // CREATE new trip
    else{

      this.tripService.addTrip(this.editTrip)
        .subscribe({
          next:()=>{

            alert("Trip added successfully");

            this.resetForm();

            this.tripSaved.emit();
          },
          error:err=>console.error("Add error:", err)
        });

    }
  }
}
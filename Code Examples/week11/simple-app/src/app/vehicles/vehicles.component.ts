import { Component, OnInit } from '@angular/core';
import {VehiclesService} from '../vehicles.service';
import Vehicle from '../Vehicle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {

  public vehicles: Vehicle[] = [];
  private vehicleSub: Subscription | undefined;

  constructor(private vs: VehiclesService) { }

  ngOnInit() {
    this.vehicleSub = this.vs.getVehicles().subscribe((v)=>{this.vehicles = v});
  }

  ngOnDestroy(){
    this.vehicleSub?.unsubscribe();
  }

}

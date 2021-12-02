import { Component, OnInit } from '@angular/core';
import User from '../User';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user:User = new User();
  public warning:string = "";

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm): void {

    this.auth.login(this.user).subscribe(
      (success) => {
        // store the returned token 
        this.auth.setToken(success.token);
        // redirect to the "vehicles" route
        this.router.navigate(['/vehicles']);
      },
      (err) => {
        this.warning = err.error.message;
      }
    );

  }
}
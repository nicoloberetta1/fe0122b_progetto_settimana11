import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile',
  template: `
  <style>
    .info{
      margin: 30px auto;
      max-width: 200px;
    }
  </style>
    <mat-tab-group>
      <mat-tab label="Info">
      <div class="info" *ngIf="user$|async as user" >
        <p>Nome:{{user.user.name}}</p>
        <p>Email:{{user.user.email}}</p>
      </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
  ]
})
export class ProfileComponent implements OnInit {
  user$ = this.auth.user$

  constructor(private auth:AuthService) { }

  ngOnInit(): void {

  }

}

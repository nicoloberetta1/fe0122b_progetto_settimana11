import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
   <app-nav>
     <router-outlet></router-outlet>
   </app-nav>

  `,
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component } from '@angular/core';

import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';

import { trigger, style, animate, transition, query } from "@angular/animations";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {


  constructor(private context: ChildrenOutletContexts) { }

  getRouteUrl() {
    return this.context.getContext('primary')?.route?.url;
  }

}

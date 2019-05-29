import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventResponse } from '../interfaces';
import { Subscription } from 'rxjs';
import { EventsService } from '../services/events/events.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private events: EventResponse[] = [];
  public sub: Subscription;

  constructor(
    private _eventsService: EventsService,
    private _nav: NavController
  ) { }

  ngOnInit() {
    this.sub = this._eventsService.getAll().subscribe((e: EventResponse) => {
      this.events.push(e);
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public getEvents(): EventResponse[] {
    return this.events.sort((a: EventResponse, b: EventResponse) => a.event.created > b.event.created ? -1 : 1 );
  }

  public details(response: EventResponse) {
    this._nav.navigateForward(`details/${response.event.id}`)
  }

}

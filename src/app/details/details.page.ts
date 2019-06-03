import { Component, OnInit } from '@angular/core';
import { EventResponse, Acknowledgement, EmergencyEvent } from '../interfaces';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  eventId: number;
  eventResponse: EventResponse;
  event: EmergencyEvent;
  acknowledgments: Acknowledgement[] = [];
  newNote: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _eventService: EventsService
  ) { }

  async ngOnInit() {
    this.eventId = +this._route.snapshot.params['eventId'];
    this.eventResponse = await this._eventService.getById(this.eventId).toPromise();
    this.event = this.eventResponse.event;
    this.acknowledgments = await this._eventService.getAcknowledgements(this.eventResponse).toPromise();
  }

}

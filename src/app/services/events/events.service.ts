import { Injectable } from '@angular/core';
import { EventResponse, Acknowledgement } from './../../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private endpoint = 'https://us-central1-ps-notify-api.cloudfunctions.net/api';

  constructor(private http: HttpClient) { }

  getAll(): Observable<EventResponse> {
    return Observable.create((observer: Observer<EventResponse>) => {
      const self = this;
      self.getLatest().subscribe(res => onNext(res), observer.error);

      function onNext(response: EventResponse) {
        observer.next(response);
        if (response.links.next) {
        self.getByRoute<EventResponse>(response.links.next).subscribe(res => onNext(res), observer.error);
        } else {
          observer.complete();
        }
      }
    });
  }

  getLatest(): Observable<EventResponse> {
    const route = `/latest`;
    return this.getByRoute(route);
  }

  getById(id: number): Observable<EventResponse> {
    const route = `/event/${id}`;
    return this.getByRoute(route);
  }

  private getByRoute<T>(route: string): Observable<T> {
    const url = `${this.endpoint}${route}`;
    return this.http.get<T>(url);
  }

  getNewestEventId(): number {
    // Higher numbers are newer
    // For now, let's return 10.
    // The REST service returns random events, from n -> 0.
    return 10;

    // Eventually, we'll want to store this value locally.
  }

  getAcknowledgements(event: EventResponse) {
    return this.getByRoute<Acknowledgement[]>(event.links.acknowledgements);
  }
}

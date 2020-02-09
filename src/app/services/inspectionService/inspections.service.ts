import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Inspection } from '../../types/Inspection';
import { Inspections } from './mock-inspections';

@Injectable({
  providedIn: 'root'
})
export class InspectionsService {

  constructor() { }

  getInspections(): Observable<Inspection[]> {
    return of(Inspections);
  }
}

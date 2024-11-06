import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private pageTitleSubject = new BehaviorSubject<string>('');

  constructor() { }

  setPageTitle(title: string): void {
    this.pageTitleSubject.next(title);
  }

  getPageTitle() {
    return this.pageTitleSubject.asObservable()
  }
}
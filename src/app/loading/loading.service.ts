import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable()
export class LoadingService {
  private loadingSubjet = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean>= this.loadingSubjet.asObservable();

  constructor() {
     console.log('Loading service created ...')
  }

  ShowLoaderUntilComplete<T>(obs$: Observable<T>): Observable<T> {
      return of(null)
        .pipe(
          tap(() => this.loadingOn()),
          concatMap(()=> obs$),
          finalize(()=> this.loadingOff())
        );
  }

  loadingOn() {
    this.loadingSubjet.next(true);
  }

  loadingOff(){
    this.loadingSubjet.next(false);

  }
}

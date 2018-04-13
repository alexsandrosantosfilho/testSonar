import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { NgRedux } from 'ng2-redux';

@Injectable()
export class ContextService {

  contextChangesSubject: BehaviorSubject<any>;
  contextChanges$: Observable<any>;
  state: any;
  ngRedux: NgRedux<any>;

  constructor() {
    this.contextChangesSubject = new BehaviorSubject<any>(this.state);
    this.contextChanges$ = this.contextChangesSubject.asObservable();
  }

  init(ngRedux: NgRedux<any>) {
    this.ngRedux = ngRedux;
    this.state = this.ngRedux.getState();
    this.contextChangesSubject.next(this.state);

    this.ngRedux.subscribe(() => {
      this.state = this.ngRedux.getState();
      this.contextChangesSubject.next(this.state);
    });
  }

  updateContext(action: any) {
    this.ngRedux.dispatch(action);
  }

}

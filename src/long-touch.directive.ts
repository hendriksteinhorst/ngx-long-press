import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/repeat';

@Directive({
    selector: '[longTouch]'
})
export class LongTouchDirective {
    @Input() public longTouch: number = 500;
    @Output() public onRelease: EventEmitter<TouchEvent> = new EventEmitter();

    public touchend$ = new Subject();
    public touchstart$ = new Subject();
    public destroys$ = new Subject();

    public ngOnInit(): void {
        const interval$ = this.interval$()
            .takeUntil(this.touchend$)
            .combineLatest(this.touchend$);

        this.touchstart$
            .asObservable()
            .map(() => interval$)
            .switch()
            .repeat()
            .map(items => items[1])
            .takeUntil(this.destroys$)
            .subscribe((event: TouchEvent) => {
                this.onRelease.emit(event);
            });
    }

    public ngOnDestroy(): void {
        this.destroys$.next();
        this.destroys$.unsubscribe();
    }

    public interval$(): Observable<number> {
        return Observable
            .interval()
            .map(i => i * 10)
            .filter(i => i > this.longTouch);
    }

    @HostListener('touchend', ['$event'])
    public onTouchEnd(event: TouchEvent): void {
        this.touchend$.next(event);
    }

    @HostListener('touchstart', ['$event']) 
    public onTouchStart(event: TouchEvent): void {
        this.touchstart$.next(event);
    }
}
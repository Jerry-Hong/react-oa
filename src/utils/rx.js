import { Observable, ReplaySubject, Scheduler } from 'rxjs';

function takeWhileInclusive(predicate) {
  return new Observable(observer => {
    const subscription = this.subscribe({
      next: value => {
        observer.next(value);

        if (!predicate(value)) {
          observer.complete();
        }
      },
      error: error => observer.error(error),
      complete: () => observer.complete(),
    });

    return subscription;
  });
}

Observable.prototype.takeWhileInclusive = takeWhileInclusive;

export { ReplaySubject };
export { Scheduler };
export default Observable;

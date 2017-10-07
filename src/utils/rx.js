import { Observable, ReplaySubject, Scheduler } from 'rxjs';

export { ReplaySubject };
export { Scheduler };
export default Observable;
export const takeWhileInclusive = predicate => source =>
  new Observable(observer => {
    const subscription = source.subscribe({
      next: value => {
        observer.next(value);

        if (!predicate(value)) {
          observer.complete();
        }
      },
      error: error => observer.error(error),
      complete: () => observer.complete(),
    });

    return () => subscription.unsubscribe();
  });

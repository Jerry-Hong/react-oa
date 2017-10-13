import { Observable } from 'rxjs';
import defaultNow from 'performance-now';

export function createAnimationFrameTicker() {
  return Observable.create(function(observer) {
    const requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    let active = true;
    let lastTick = defaultNow();
    const dispatch = timestamp => {
      const currentTime = timestamp || defaultNow();
      const timeDelta = currentTime - lastTick;
      observer.next(timeDelta);

      if (active) {
        this.id = requestAnimationFrame(dispatch);
      }
    };

    requestAnimationFrame(dispatch);

    return () => {
      active = false;
      cancelAnimationFrame(this.id);
    };
  });
}

export default createAnimationFrameTicker();

import Observable, { Scheduler, takeWhileInclusive } from './rx.js';

const animationFrame = Scheduler.animationFrame;

export const duration = ms =>
  Observable.defer(() => {
    const subAt = animationFrame.now();
    return Observable.interval(0, animationFrame).map(
      () => animationFrame.now() - subAt
    );
  })
    .map(time => time / ms)
    .let(takeWhileInclusive(p => p <= 1))
    .map(p => (p > 1 ? 1 : p));

export const distance = px => p => p * px;

export const objectPropertyMinus = (obj, obj2) =>
  Object.keys(obj).reduce((state, key) => {
    state[key] = obj2[key] - obj[key];
    return state;
  }, {});

export const objectPropertyAdd = obj => obj2 =>
  Object.keys(obj).reduce((state, key) => {
    state[key] = obj2[key] + obj[key];
    return state;
  }, {});

export const objectPropertyTransform = obj => p =>
  Object.keys(obj).reduce((state, key) => {
    state[key] = obj[key] * p;
    return state;
  }, {});

import Observable from './rx.js';
import { createAnimationFrameTicker } from './animationObservable';

const animationFrame = Scheduler.animationFrame;

export const duration = ms =>
  createAnimationFrameTicker()
    .map(time => time / ms)
    .takeWhileInclusive(p => p <= 1)
    .map(p => (p <= 1 ? p : 1));

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

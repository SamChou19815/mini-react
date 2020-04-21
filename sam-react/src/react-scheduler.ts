import { VirtualDOMNode } from './types';
import Scheduler from './scheduler';

type RerenderJob = () => readonly [VirtualDOMNode, VirtualDOMNode];

let scheduler: Scheduler<RerenderJob> | null = null;

export const registerJobRunner = (runner: (job: RerenderJob) => void): void => {
  scheduler = new Scheduler(runner);
};

export const getScheduler = (): Scheduler<RerenderJob> => {
  if (scheduler === null) {
    throw new Error();
  }
  return scheduler;
};

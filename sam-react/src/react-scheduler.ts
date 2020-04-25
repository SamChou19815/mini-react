import { StatefulComponent, ReactElement } from './types';
import Scheduler from './scheduler';

type RerenderJob = () => readonly [StatefulComponent, ReactElement];

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

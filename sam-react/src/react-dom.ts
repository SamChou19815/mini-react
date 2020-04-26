/** The module bootstraps a react app. */

import { ReactElement, Component } from './types';
import { runEffects } from './renderer-runtime';
import { registerJobRunner, getScheduler } from './react-scheduler';
import { instantiateComponent, mountComponent, updateComponent } from './component-lifecyles';

let rootComponent: Component | null = null;

registerJobRunner((job) => {
  if (rootComponent === null) {
    throw new Error();
  }
  const [statefulComponent, nextElement] = job();
  updateComponent(statefulComponent, nextElement);
  // Effects are always run after DOM are updated!
  runEffects();
});

export default (reactElement: ReactElement, rootContainer: HTMLElement): void => {
  rootComponent = instantiateComponent(reactElement);
  const rootDOM = mountComponent(rootComponent);
  // Effects are always run after DOM are updated!
  runEffects();
  rootContainer.appendChild(rootDOM);
  // At this point, we finished our first pass of the rendering.
  // If there is no additional state changes, we can just stop here.

  // Here starts our simple scheduler.
  getScheduler().runQueuedJobs();
};

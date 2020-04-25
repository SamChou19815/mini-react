/** The module bootstraps a react app. */

import { ReactElement, Component, StatefulComponent } from './types';
import { runEffects } from './renderer-runtime';
import { registerJobRunner, getScheduler } from './react-scheduler';
import { instantiateComponent, mountComponent, updateComponent } from './component-lifecyles';

let rootComponent: Component | null = null;

const patchComponentTreeInplace = (
  rootNode: Component,
  updatedComponent: StatefulComponent,
  oldDOMNode: HTMLElement,
  newDOMNode: HTMLElement
): void => {
  if (rootNode.type === 'functional') {
    if (rootNode.renderedComponent === updatedComponent) {
      rootNode.realDOMNode = newDOMNode;
    }
    patchComponentTreeInplace(rootNode.renderedComponent, updatedComponent, oldDOMNode, newDOMNode);
    return;
  }
  for (let i = 0; i < rootNode.children.length; i += 1) {
    const child = rootNode.children[i];
    if (child === updatedComponent) {
      rootNode.realDOMNode.replaceChild(newDOMNode, oldDOMNode);
      break;
    }
  }
};

registerJobRunner((job) => {
  if (rootComponent === null) {
    throw new Error();
  }
  const [statefulComponent, nextElement] = job();
  updateComponent(statefulComponent, nextElement);
  // Effects are always run after DOM are updated!
  runEffects();
});

export default (reactElement: ReactElement): void => {
  rootComponent = instantiateComponent(reactElement);
  const rootDOM = mountComponent(rootComponent);
  // Effects are always run after DOM are updated!
  runEffects();
  document.body.appendChild(rootDOM);
  // At this point, we finished our first pass of the rendering.
  // If there is no additional state changes, we can just stop here.

  // Here starts our simple scheduler.
  getScheduler().runQueuedJobs();
};

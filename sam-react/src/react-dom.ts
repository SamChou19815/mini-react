/** The module bootstraps a react app. */

import { ReactElement, VirtualDOMNode, VirtualAndRealDOM } from './types';
import updateDOM from './dom-manipulator';
import { fullyEvaluateReactNode, runEffects } from './renderer-runtime';
import { registerJobRunner, getScheduler } from './react-scheduler';

let rootContainer: HTMLElement | null = null;
let root: VirtualAndRealDOM | null = null;

const deepCopyVirtualDOM = (rootNode: VirtualDOMNode): VirtualDOMNode => ({
  ...rootNode,
  children: rootNode.children.map(deepCopyVirtualDOM),
});

const patchVirtualDOMInPlace = (
  rootNode: VirtualDOMNode,
  old: VirtualDOMNode,
  updated: VirtualDOMNode
): VirtualDOMNode => {
  if (rootNode === old) {
    return updated;
  }
  for (let i = 0; i < rootNode.children.length; i += 1) {
    const child = rootNode.children[i];
    const updatedChild = patchVirtualDOMInPlace(child, old, updated);
    if (updated == updatedChild) {
      rootNode.children[i] = updatedChild;
    }
  }
  return rootNode;
};

const rerenderTODOM = (newVirtualDOM: VirtualDOMNode): void => {
  if (root === null) {
    throw new Error();
  }
  // Most of the time, DOM update can be completely done here!
  const newReal = updateDOM(newVirtualDOM, root);
  // Effects are always run after DOM are updated!
  runEffects();
  root.virtual = newVirtualDOM;
  if (newReal !== root.real) {
    // If the root is replaced, then we need unmount the old root and mount the new one.
    if (rootContainer === null) {
      throw new Error();
    }
    rootContainer.removeChild(root.real);
    rootContainer.appendChild(newReal);
    root.real = newReal;
  }
};

registerJobRunner((job) => {
  const [oldVirtualDOM, newVirtualDOM] = job();
  if (root === null) {
    throw new Error();
  }
  const newRootVirtualDOM = root.virtual;
  // Deep copy the old virtual DOM tree so that reconciler can compare the props between rerenders.
  const oldRootVirtualDOM = deepCopyVirtualDOM(newRootVirtualDOM);
  root.virtual = oldRootVirtualDOM;
  // Stick the updated node in the correct place.
  rerenderTODOM(patchVirtualDOMInPlace(newRootVirtualDOM, oldVirtualDOM, newVirtualDOM));
});

export default (reactElement: ReactElement, container: HTMLElement): void => {
  const virtual = fullyEvaluateReactNode(reactElement);
  const real = updateDOM(virtual);
  // Effects are always run after DOM are updated!
  runEffects();
  root = { virtual, real };
  container.appendChild(real);
  rootContainer = container;
  // At this point, we finished our first pass of the rendering.
  // If there is no additional state changes, we can just stop here.

  // Here starts our simple scheduler.
  getScheduler().runTheQueuedJobs();
};

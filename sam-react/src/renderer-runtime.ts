/** The module contains runtime support for the render phase. */

import { ReactElement, UseStateReturns, StatefulComponent, VirtualDOMNode } from './types';
import { getScheduler } from './react-scheduler';

let currentComponent: StatefulComponent | null = null;
const globalEffectQueue: (() => void)[] = [];

export const useState = (defaultValue: any): UseStateReturns => {
  const statefulComponent = currentComponent;
  if (statefulComponent === null) {
    throw new Error();
  }
  const { states, currentStateIndex } = statefulComponent;
  if (currentStateIndex > states.length || currentStateIndex < 0) {
    throw new Error();
  }
  if (currentStateIndex == states.length) {
    const constructedNewStateSlot: UseStateReturns = [
      defaultValue,
      (newValue: any) => {
        if (states[currentStateIndex][0] === newValue) {
          // Bailout of update if state doesn't change.
          return;
        }
        states[currentStateIndex][0] = newValue;
        // Tells schedular how to rerender!
        getScheduler().addJob(() => [
          statefulComponent.virtualDOMNode!,
          fullyEvaluateReactNode(statefulComponent.reactElement, statefulComponent),
        ]);
      },
    ];
    states.push(constructedNewStateSlot);
    statefulComponent.currentStateIndex += 1;
    return constructedNewStateSlot;
  }
  statefulComponent.currentStateIndex += 1;
  return states[currentStateIndex];
};

export const useEffect = (effect: () => void): void => {
  if (currentComponent === null) {
    throw new Error();
  }
  globalEffectQueue.push(effect);
};

const shallowEvaluateReactNode = (
  statefulComponent: StatefulComponent,
  children: readonly (ReactElement | ReactElement[])[]
): ReactElement => {
  // Inject hooks runtime for rendering.
  currentComponent = statefulComponent;
  const partiallyReducedNode = statefulComponent.component({
    ...statefulComponent.reactElement.props,
    children,
  });
  // De-inject hooks runtime for rendering.
  currentComponent = null;
  return partiallyReducedNode;
};

export const fullyEvaluateReactNode = (
  node: ReactElement,
  statefulComponent?: StatefulComponent
): VirtualDOMNode => {
  const { component, props } = node;
  if (component === 'div' || component === 'input') {
    return {
      component,
      props,
      children: node.children.map((child) => fullyEvaluateReactNode(child)),
    };
  }
  if (component === 'span') {
    // Do some special handling of children props passing, to make it always available in the props.
    let children: string = props.children;
    if (children == null) {
      children = (node.children[0] as unknown) as string;
    }
    return { component, props: { children }, children: [] };
  }
  const currentStatefulComponent: StatefulComponent = statefulComponent ?? {
    component,
    reactElement: node,
    virtualDOMNode: null,
    states: [],
    currentStateIndex: 0,
  };
  const partiallyReducedNode = shallowEvaluateReactNode(currentStatefulComponent, node.children);
  const fullyReducedNode = fullyEvaluateReactNode(partiallyReducedNode);
  fullyReducedNode.statefulComponent = currentStatefulComponent;
  currentStatefulComponent.currentStateIndex = 0;
  currentStatefulComponent.virtualDOMNode = fullyReducedNode;
  return fullyReducedNode;
};

export const runEffects = (): void => {
  globalEffectQueue.forEach((effect) => effect());
  // Running effects will not add new effects, assuming rules of hooks are followed.
  globalEffectQueue.length = 0;
};

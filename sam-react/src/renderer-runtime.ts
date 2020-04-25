/** The module contains runtime support for the render phase. */

import { ReactElement, UseStateReturns, StatefulComponent } from './types';
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
        // Tells schedular how to rerender!
        getScheduler().addJob(() => {
          states[currentStateIndex][0] = newValue;
          return [statefulComponent, renderWithRuntime(statefulComponent)];
        });
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

export const renderWithRuntime = (statefulComponent: StatefulComponent): ReactElement => {
  // Inject hooks runtime for rendering.
  currentComponent = statefulComponent;
  const partiallyReducedNode = statefulComponent.component(statefulComponent.currentElement.props);
  // De-inject hooks runtime for rendering.
  statefulComponent.currentStateIndex = 0;
  currentComponent = null;
  return partiallyReducedNode;
};

export const runEffects = (): void => {
  globalEffectQueue.forEach((effect) => effect());
  // Running effects will not add new effects, assuming rules of hooks are followed.
  globalEffectQueue.length = 0;
};

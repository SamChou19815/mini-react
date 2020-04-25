/*
 * You can see a lot of use of `any` in the codebase.
 * Usually you want to avoid that.
 * However, react runtime is too dynamic so that avoiding all uses of any is impossible.
 */

export type ComponentType<Props extends {} = any> = (props: Props) => ReactElement<any>;

export type ReactElement<Props extends {} = any> = {
  readonly component: ComponentType<Props> | 'div' | 'input' | 'span';
  readonly props: Props;
  readonly children: readonly ReactElement[];
};

export type UseStateReturns = [any, (value: any) => void];

export type StatefulComponent = {
  // Properties necessary for rerender
  readonly type: 'functional';
  readonly component: ComponentType;
  props: any;
  currentElement: ReactElement;
  renderedComponent: Component;
  realDOMNode: HTMLElement;
  // States
  readonly states: UseStateReturns[];
  currentStateIndex: number;
};
export type StatelessComponent = {
  readonly type: 'intrinsic';
  component: 'div' | 'input' | 'span';
  currentElement: ReactElement;
  children: Component[];
  realDOMNode: HTMLElement;
};
export type Component = StatefulComponent | StatelessComponent;

export type VirtualAndRealDOM = { virtual: Component; real: HTMLElement };

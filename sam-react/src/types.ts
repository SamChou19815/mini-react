export type ComponentType<Props extends {} = any> = (props: Props) => ReactElement<any>;

export type ReactElement<Props extends {} = any> = {
  readonly component: ComponentType<Props> | 'div' | 'input' | 'span';
  readonly props: Props;
  readonly children: readonly ReactElement[];
};

export type UseStateReturns = [any, (value: any) => void];

export type StatefulComponent = {
  // Properties necessary for rerender
  readonly component: ComponentType;
  readonly reactElement: ReactElement;
  virtualDOMNode: VirtualDOMNode | null;
  // States
  readonly states: UseStateReturns[];
  currentStateIndex: number;
};

export type VirtualDOMNode = {
  readonly component: 'div' | 'input' | 'span';
  readonly props: any;
  readonly children: VirtualDOMNode[];
  statefulComponent?: StatefulComponent;
};

export type VirtualAndRealDOM = { virtual: VirtualDOMNode; real: HTMLElement };

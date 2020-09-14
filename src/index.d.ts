declare namespace tyny {
  type AnyObject = Object & Map<any>;
  type Map<T> = { [key: string]: T };

  // DOM API
  // -------

  type ElementQuery = string | ElementLike;
  type ElementLike =
    | EventTarget
    | Node
    | Node[]
    | NodeList
    | HTMLCollection
    | undefined
    | null;

  // Geom
  // ----

  interface ClientPoint {
    clientX: number;
    clientY: number;
  }

  interface BoundingBox {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  }

  interface Dimensions {
    height: number;
    width: number;
  }

  interface BareClientRect {
    left: number;
    bottom: number;
    right: number;
    top: number;
  }

  interface ClientRect extends BareClientRect, Dimensions {}

  interface Interval {
    min: number;
    max: number;
  }

  interface Point {
    x: number;
    y: number;
  }

  // View
  // ----

  interface View {
    callUpdate(type?: string): void;
    destroy(): void;
  }

  interface ViewApi extends View {
    readonly _isConnected: boolean;
    _callConnected(): void;
    _callDisconnected(): void;
  }

  type ViewMap = Map<View>;
  type ViewApiMap = Map<ViewApi>;
}

declare namespace process {
  namespace env {
    const NODE_ENV: string;
    const TYNY_PREFIX: string;
  }
}

interface Element {
  __tynyViews?: tyny.ViewMap;
}

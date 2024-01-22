export type EventMap = Record<string, Record<string, string | number>>;

export type EventCache = Record<
  string,
  TouchList | Record<string, Record<string, any>>
>;

export type PointerTypes = Record<string | number, string>;

export type PWTarget =
  | (EventTarget & {
      nodeType: number;
      parentNode: HTMLElement;
      nodeName: string;
    })
  | HTMLElement;

export type IEvent = (
  | PointerEvent
  | MouseEvent
  | TouchEvent
  | WheelEvent
  | KeyboardEvent
) & {
  button: number;
  pointerType: string;
  target: PWTarget;
  pointerId?: number;
  touches?: TouchList;
  wheelDelta?: number;
};

export interface PWEvent {
  pointerId?: number;
  wheelDelta?: number;
  detail: number;
  which?: number;
  keyCode?: number;
  button: number;
  length: number;
  clientX: number;
  clientY: number;
  eventCode: number;
  pointerType?: string;
  target: PWTarget;
  oldEvent: IEvent;
  type: string;
  eventType: string;
  returnValue?: boolean;
  preventDefault: () => void;
}

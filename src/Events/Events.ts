import { BrowserSupport } from "BrowserSupport";
import type {
  IEvent,
  PWEvent,
  EventMap,
  EventCache,
  PointerTypes,
} from "./types";

export class Events {
  public POINTERS: EventCache = {
    touch: {},
    pointer: {},
    mouse: {},
  };
  public static readonly WHEEL_EVENTS = [
    "mousewheel",
    "DOMMouseScroll",
  ] as const;
  public static readonly MOVE_EVENTS: string[] = [];
  public static readonly START_EVENTS: string[] = [];
  private static readonly EVENT_PREFIXES = [
    "mouse",
    "touch",
    "pointer",
    "MSPointer-",
  ] as const;
  public static readonly POINTER_TYPES: PointerTypes = {
    2: "touch",
    3: "pen",
    4: "mouse",
    pen: "pen",
  };
  public static readonly CODES: Record<string, number> = {
    click: 4,
    mousewheel: 5,
    dommousescroll: 5,
    keydown: 6,
  };
  private static readonly STATES: Record<string, number> = {
    start: 1,
    down: 1,
    move: 2,
    end: 3,
    up: 3,
    cancel: 3,
  };
  public static readonly EVENT_TO_TYPE: Record<string, string> = {};
  public static readonly CLASS_TO_TYPE: Record<string, string> = {};
  public static readonly EVENT_MAP: EventMap = Events.createMap();
  private static readonly eventDatum = [
    "wheelDelta",
    "detail",
    "which",
    "keyCode",
  ] as const;

  private static createMap() {
    const map: EventMap = {};
    this.EVENT_PREFIXES.forEach((prefix) => {
      const _prefix = /pointer/i.test(prefix) ? "pointer" : prefix;
      map[_prefix] = map[_prefix] || {};
      this.POINTER_TYPES[_prefix] = _prefix;
      for (const suffix in this.STATES) {
        const code = this.STATES[suffix];
        const event = BrowserSupport.camelCase(prefix + suffix);
        map[_prefix][event] = code;
        const lowered = event.toLowerCase();
        this.EVENT_TO_TYPE[lowered] = _prefix;
        this.CODES[lowered] = code;
        if (code == 1) {
          this.START_EVENTS.push(event);
        } else {
          this.MOVE_EVENTS.push(event);
        }
      }
    });
    return map;
  }

  public filterEvent<E extends IEvent>(oldEvent: E) {
    const event = {} as PWEvent;
    const which = oldEvent.which;
    const button = oldEvent.button;
    Events.eventDatum.forEach((property) => {
      // @ts-ignore
      event[property] = oldEvent[property];
    });
    event.oldEvent = oldEvent;
    event.type = oldEvent.type.toLowerCase();
    event.eventType = Events.EVENT_TO_TYPE[event.type] || event.type;
    event.eventCode = Events.CODES[event.type] || 0;
    event.pointerType =
      Events.POINTER_TYPES[oldEvent.pointerType] ||
      oldEvent.pointerType ||
      event.eventType;
    event.target =
      oldEvent.target ||
      oldEvent.srcElement ||
      BrowserSupport.DOC.documentElement;
    if (event.target.nodeType === 3) {
      event.target = event.target.parentNode as HTMLElement;
    }
    event.preventDefault = () => {
      if (!BrowserSupport.passive) {
        oldEvent.preventDefault();
        event.returnValue = oldEvent.returnValue = false;
      }
    };
    let pointers = this.POINTERS[event.eventType] as Record<string, any>;
    if (pointers) {
      switch (event.eventType) {
        case "mouse":
        case "pointer": {
          const id = oldEvent.pointerId || 0;
          event.eventCode == 3
            ? delete pointers[id]
            : (pointers[id] = oldEvent);
          break;
        }
        case "touch": {
          const touches = oldEvent.touches as TouchList;
          this.POINTERS[event.eventType] = pointers = touches;
          break;
        }
      }
      const pointer = this.pointerItem(pointers, 0);
      if (pointer) {
        event.clientX = pointer.clientX;
        event.clientY = pointer.clientY;
      }
      event.button =
        which < 4 ? Math.max(0, which - 1) : (button & 4 && 1) || button & 2; // left:0 middle:1 right:2
      event.length = Events.pointerLength(pointers);
    }
    return event;
  }

  private pointerItem(obj: Record<string, any>, n: number) {
    if ("item" in obj) {
      return obj.item(n);
    }
    let i = 0;
    for (const key in obj) {
      if (i++ === n) {
        return obj[key];
      }
    }
  }

  private static pointerLength(obj: Record<string, any>) {
    if (this.type(obj.length) == "number") {
      return obj.length;
    }
    if ("keys" in Object) {
      return Object.keys(obj).length;
    }
    let len = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        len++;
      }
    }
    return len;
  }

  public static type(obj: any) {
    if (obj === null) {
      // eslint-disable-next-line
      return obj + "";
    }
    return typeof obj == "object" || typeof obj == "function"
      ? Events.CLASS_TO_TYPE[toString.call(obj)] || "object"
      : typeof obj;
  }
}

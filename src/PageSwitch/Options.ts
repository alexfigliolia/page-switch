import type { EaseString, EasingFN } from "Easing";
import { Easing } from "Easing";
import type { TransitionName } from "Transitions";
import {
  Transitions,
  type Transition,
  type TransitionFN,
  type ITransitions,
} from "Transitions";
import type { IDOrElement, IOptions, ListenerCache, PageDatum } from "./types";

export class Options {
  current = 0;
  loop: boolean;
  ease: EasingFN;
  length: number;
  mouse: boolean;
  frozen: boolean;
  playing: boolean;
  duration: number;
  direction: 1 | 0;
  interval: number;
  arrowKey: boolean;
  mousewheel: boolean;
  container: HTMLElement;
  transition: TransitionFN;
  events: ListenerCache = {
    update: [],
  };
  pages: HTMLElement[] = [];
  pageData: PageDatum[] = [];
  transitionName: TransitionName | "" = "";
  private readonly transitions: ITransitions;
  constructor(selector: IDOrElement, config: Partial<IOptions>) {
    const options = this.withDefaults(config);
    this.container = this.getSelector(selector);
    this.loop = !!options.loop;
    this.mouse = !!options.mouse;
    this.frozen = !!options.frozen;
    this.playing = !!options.autoplay;
    this.arrowKey = !!options.arrowKey;
    this.mousewheel = !!options.mousewheel;
    this.current = this.parseInt(options.start, 0);
    this.duration = this.parseInt(options.duration, 600);
    this.interval = this.parseInt(options.interval, 5000);
    this.direction = this.integer(options.direction) == 0 ? 0 : 1;
    this.pages = this.children(this.container);
    this.length = this.pages.length;
    this.initializePages();
    this.transitions = Transitions.create(this);
    this.ease = this.setEasing(options.ease);
    this.transition = this.setTransition(options.transition);
  }

  public static readonly defaults: IOptions = {
    duration: 600,
    direction: 1,
    loop: true,
    start: 0,
    mouse: true,
    ease: Easing.ease,
    autoplay: false,
    mousewheel: true,
    interval: 5000,
    arrowKey: true,
    frozen: false,
    transition: "slide",
  };

  public setEasing(type: EasingFN | EaseString) {
    if (typeof type === "string") {
      this.ease = Easing[type];
    } else {
      this.ease = type;
    }
    return this.ease;
  }

  public setTransition(type: Transition | TransitionFN) {
    let transition: TransitionFN;
    if (typeof type === "function") {
      transition = type;
      this.transitionName = "";
    } else {
      transition = this.transitions[type] || this.transitions.slide;
      this.transitionName = type in this.transitions ? type : "slide";
    }
    this.events.update.splice(0, 1, transition);
    return transition;
  }

  protected fixIndex(index: number) {
    return this.length > 1 && this.loop
      ? (this.length + index) % this.length
      : index;
  }

  private withDefaults(config: Partial<IOptions>) {
    return Object.assign({}, Options.defaults, config) as unknown as IOptions;
  }

  private initializePages() {
    this.pages.forEach((page) => {
      this.pageData.push({
        percent: 0,
        cssText: page.style.cssText || "",
      });
      this.positionElement(page);
    });
    this.pages[this.current].style.display = "block";
  }

  private parseInt(value: any, fallback: number) {
    return isNaN(this.integer(value)) ? fallback : (value as number);
  }

  private integer(value: any) {
    return parseInt(value);
  }

  private getSelector(ID: string | HTMLElement) {
    if (typeof ID === "string") {
      return document.getElementById(ID)!;
    }
    return ID;
  }

  private children(element: HTMLElement) {
    const result: HTMLElement[] = [];
    const iterable = Array.from(element.children || element.childNodes);
    iterable.forEach((node) => {
      if (node.nodeType == 1) {
        result.push(node as HTMLElement);
      }
    });
    return result;
  }

  protected positionElement(element: HTMLElement) {
    const style = element.style;
    let pointer = -1;
    for (const property of Options.defaultStyles) {
      style[property] = Options.defaultValues[++pointer];
    }
    return element;
  }

  private static readonly defaultStyles = [
    "position",
    "top",
    "left",
    "width",
    "height",
    "display",
  ] as const;

  private static readonly defaultValues = [
    "absolute",
    "0",
    "0",
    "100%",
    "100%",
    "none",
  ];
}

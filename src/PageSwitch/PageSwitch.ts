import { Animation } from "Animation";
import { BrowserSupport } from "BrowserSupport";
import { Events, type IEvent, type PWEvent } from "Events";
import type { Nullable } from "Types";
import { Options } from "./Options";
import type {
  Rect,
  IOptions,
  IDOrElement,
  PageSwitchEvent,
  PageSwitchEvents,
} from "./types";

export class PageSwitch extends Options {
  Animation = new Animation();
  rect: Nullable<Rect> = null;
  drag: Nullable<boolean> = null;
  EventsInterface = new Events();
  offset: Nullable<number> = null;
  percent: Nullable<number> = null;
  pointerType: Nullable<string> = null;
  offsetParent: Nullable<HTMLElement> = null;
  playTimer: Nullable<ReturnType<typeof setTimeout>> = null;
  eventTimer: Nullable<ReturnType<typeof setTimeout>> = null;
  constructor(selector: IDOrElement, config: Partial<IOptions>) {
    super(selector, config);
    this.handler = this.handler.bind(this);
    this.firePlay = this.firePlay.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.clearPlayTimer = this.clearPlayTimer.bind(this);
    this.addListeners();
    this.on("after", this.firePlay);
    this.on("before", this.clearPlayTimer);
    this.on("dragStart", this.onDragStart);
    this.firePlay();
  }

  public play() {
    this.playing = true;
    return this.firePlay();
  }

  public pause() {
    this.playing = false;
    this.clearPlayTimer();
  }

  public previous() {
    return this.slide(this.current - 1);
  }

  public next() {
    return this.slide(this.current + 1);
  }

  public on<E extends PageSwitchEvent>(
    event: E,
    callback: PageSwitchEvents[E]
  ) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  public freeze(frozen: boolean) {
    this.frozen = frozen;
  }

  public destroy() {
    this.offListeners();
    this.pages.forEach((page, index) => {
      page.style.cssText = this.pageData[index].cssText;
    });
    this.length = 0;
    return this.pause();
  }

  public append(element: HTMLElement, index: number = this.pages.length) {
    this.pageData.splice(index, 0, {
      percent: 0,
      cssText: element.style.cssText,
    });
    this.pages.splice(index, 0, element);
    this.container.appendChild(this.positionElement(element));
    this.length = this.pages.length;
    if (index <= this.current) {
      this.current++;
    }
  }

  public prepend(element: HTMLElement) {
    return this.append(element, 0);
  }

  public insertBefore(element: HTMLElement, index: number) {
    return this.append(element, index - 1);
  }

  public insertAfter(element: HTMLElement, index: number) {
    return this.append(element, index + 1);
  }

  public remove(index: number) {
    this.container.removeChild(this.pages[index]);
    this.pages.splice(index, 1);
    this.pageData.splice(index, 1);
    this.length = this.pages.length;
    if (index <= this.current) {
      this.slide((this.current = Math.max(0, this.current - 1)));
    }
  }

  public setInterval(interval: number) {
    this.interval = interval;
    this.clearPlayTimer();
    if (!this.playing) {
      this.playing = true;
    }
    this.firePlay();
  }

  private addListeners() {
    this.listen("addEventListener");
  }

  private offListeners() {
    this.listen("removeEventListener");
  }

  private listen(mode: "addEventListener" | "removeEventListener") {
    const containerEvents: string[] = ["click", ...Events.START_EVENTS];
    if (this.mousewheel) {
      containerEvents.push(...Events.WHEEL_EVENTS);
    }
    const handler = this.handler as unknown as EventListener;
    containerEvents.forEach((event) => {
      this.container[mode](event, handler, BrowserSupport.passive);
    });
    const documentEvents = [...Events.MOVE_EVENTS];
    if (this.arrowKey) {
      documentEvents.push("keydown");
    }
    documentEvents.forEach((event) => {
      BrowserSupport.DOC[mode](event, handler, BrowserSupport.passive);
    });
  }

  private get isStatic() {
    return !this.Animation.lastFrame && !this.drag;
  }

  private getPercent(index: number) {
    const datum = this.pageData[index == null ? this.current : index];
    return datum && (datum.percent || 0);
  }

  private getOffsetParent(): HTMLElement {
    const position = BrowserSupport.getStyle(this.container, "position");
    if (position && position != "static") {
      return this.container;
    }
    return (this.container.offsetParent ||
      BrowserSupport.DOC.body) as HTMLElement;
  }

  private fire(type: string, ...rest: any[]) {
    const handlers = this.events[type] || [];
    handlers.forEach((handler) => {
      if (typeof handler === "function") {
        handler(...rest);
      }
    });

    return this;
  }

  private fixBlock(current: number, next: number) {
    this.pages.forEach((page, index) => {
      if (current != index && next != index) {
        page.style.display = "none";
      } else {
        page.style.display = "block";
      }
    });
    return this;
  }

  private fixUpdate(current: number, index: number, nextIndex: number) {
    const currentPage = this.pages[index];
    const nextPage = this.pages[nextIndex];
    let nextPercent: number | undefined;
    this.pageData[index].percent = current;
    if (nextPage) {
      nextPercent = this.pageData[nextIndex].percent =
        current > 0 ? current - 1 : 1 + current;
    }
    return this.fire("update", currentPage, current, nextPage, nextPercent);
  }

  private canDrag(event: PWEvent) {
    return (
      this.draggable &&
      event.button < 1 &&
      event.length < 2 &&
      (!this.pointerType || this.pointerType == event.eventType)
    );
  }

  private resetNullables() {
    this.rect = null;
    this.drag = null;
    this.percent = null;
    this.offset = null;
    this.offsetParent = null;
    this.Animation.resetCurrent();
  }

  private firePlay() {
    if (this.playing) {
      this.playTimer = setTimeout(() => {
        this.slide((this.current + 1) % (this.loop ? Infinity : this.length));
      }, this.interval);
    }
  }

  private clearPlayTimer() {
    if (this.playTimer) {
      clearTimeout(this.playTimer);
      this.playTimer = null;
    }
  }

  private onDragStart() {
    this.clearPlayTimer();
    this.removeRange();
  }

  public slide(index: number) {
    let duration = this.duration;
    const startTime = +new Date();
    const current = this.current;
    const fixIndex = Math.min(
      this.length - 1,
      Math.max(0, this.fixIndex(index))
    );
    const currentPage = this.pages[current];
    let percent = this.getPercent(this.current);
    const nextIndex = this.fixIndex(
      fixIndex == current ? current + (percent > 0 ? -1 : 1) : fixIndex
    );
    const nextPage = this.pages[nextIndex];
    let target = index > current ? -1 : 1;
    let prospectiveNextPage = currentPage;
    this.Animation.cancel();
    if (fixIndex == current) {
      target = 0;
      prospectiveNextPage = nextPage;
    } else if (nextPage.style.display == "none") {
      percent = 0;
    }
    this.fixBlock(current, nextIndex);
    this.fire("before", current, fixIndex);
    this.current = fixIndex;
    duration *= Math.abs(target - percent);
    this.Animation.markTransition(startTime + duration);
    const animation = () => {
      const offset = Math.min(duration, +new Date() - startTime),
        s = duration ? this.ease(offset, 0, 1, duration) : 1,
        cp = (target - percent) * s + percent;
      this.fixUpdate(cp, current, nextIndex);
      if (offset == duration) {
        if (prospectiveNextPage) {
          prospectiveNextPage.style.display = "none";
        }
        this.Animation.lastFrame = null;
        this.fire("after", fixIndex, current);
      } else {
        this.Animation.run(animation);
      }
    };
    animation();
    return this;
  }

  private clearEventTimer() {
    if (this.eventTimer) {
      clearTimeout(this.eventTimer);
      this.eventTimer = null;
    }
  }

  private removeRange() {
    if ("getSelection" in BrowserSupport.ROOT) {
      const range = getSelection();
      if (!range) {
        return;
      }
      if ("empty" in range) {
        range.empty();
      } else if ("removeAllRanges" in range) {
        // @ts-ignore
        range.removeAllRanges();
      }
    } else {
      // @ts-ignore
      BrowserSupport.DOC.selection.empty();
    }
  }

  private handler<E extends IEvent>(oldEvent: E) {
    if (this.frozen) {
      return;
    }
    const ev = this.EventsInterface.filterEvent(oldEvent);
    const canDrag = this.canDrag(ev);
    switch (ev.eventCode) {
      case 2:
        if (canDrag && this.rect && this.offsetParent) {
          const rect: Rect = [ev.clientX, ev.clientY];
          const offset = rect[this.direction] - this.rect[this.direction];
          const total =
            this.offsetParent[this.direction ? "clientHeight" : "clientWidth"];
          if (this.drag === null && this.rect.toString() != rect.toString()) {
            this.drag =
              Math.abs(offset) >=
              Math.abs(
                rect[1 - this.direction] - this.rect[1 - this.direction]
              );
            this.drag && this.fire("dragStart", ev);
          }
          if (this.drag && this.percent !== null) {
            let percent = this.percent + (total && offset / total);
            const nextIndex = this.fixIndex(
              this.current + (percent > 0 ? -1 : 1)
            );
            if (!this.pages[nextIndex]) {
              percent /= Math.abs(offset) / total + 2;
            }
            this.fixBlock(this.current, nextIndex);
            this.fire("dragMove", ev);
            this.fixUpdate(percent, this.current, nextIndex);
            this.offset = offset;
            ev.preventDefault();
          }
        }
        if (
          this.drag &&
          this.pointerType !== "touch" &&
          ev.eventType === "touch"
        ) {
          ev.preventDefault();
        }
        break;
      case 1:
      case 3:
        if (canDrag) {
          const percent = this.getPercent(this.current);
          let index = this.current;
          if (ev.length && (ev.eventCode == 1 || this.drag)) {
            const nodeName = ev.target.nodeName.toLowerCase();
            this.clearEventTimer();
            if (!this.pointerType) {
              this.pointerType = ev.eventType;
            }
            this.Animation.cancel();
            this.rect = [ev.clientX, ev.clientY];
            this.percent = percent;
            this.Animation.setCurrent();
            this.offsetParent = this.getOffsetParent();
            if (
              ev.eventType != "touch" &&
              (nodeName === "a" || nodeName === "img")
            ) {
              ev.preventDefault();
            }
          } else if (this.Animation.currentTime) {
            const currentTime = this.Animation.currentTime;
            const offset = this.offset;
            const isDrag = this.drag;
            this.resetNullables();
            if (isDrag && offset) {
              if (
                (+new Date() - currentTime < 500 && Math.abs(offset) > 20) ||
                Math.abs(percent) > 0.5
              ) {
                index += offset > 0 ? -1 : 1;
              }
              this.fire("dragEnd", ev);
              ev.preventDefault();
            }
            if (percent) {
              this.slide(index);
            } else if (isDrag) {
              this.firePlay();
            }
            this.eventTimer = setTimeout(() => {
              this.pointerType = null;
            }, 400);
          }
        }
        break;
      case 4:
        if (this.Animation.lastFrame) {
          ev.preventDefault();
        }
        break;
      case 5:
        ev.preventDefault();
        if (
          this.isStatic &&
          this.Animation.sinceLastTransition > Math.max(1000 - this.duration, 0)
        ) {
          const delta = ev.wheelDelta || -ev.detail;
          if (Math.abs(delta) >= 3) {
            if (delta > 0) {
              this.previous();
            } else {
              this.next();
            }
          }
        }
        break;
      case 6: {
        const nodeName = ev.target.nodeName.toLowerCase();
        if (
          this.isStatic &&
          nodeName != "input" &&
          nodeName != "textarea" &&
          nodeName != "select"
        ) {
          switch (ev.keyCode || ev.which) {
            case 33:
            case 37:
            case 38:
              this.previous();
              break;
            case 32:
            case 34:
            case 39:
            case 40:
              this.next();
              break;
            case 35:
              this.slide(this.length - 1);
              break;
            case 36:
              this.slide(0);
              break;
          }
        }
        break;
      }
    }
  }
}

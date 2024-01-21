import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name } from "./types";

export class Scroll extends Effect implements BaseEffect {
  public create(name: Name) {
    return (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      const prop = name || this.XY[this.PW.direction];
      BrowserSupport.transform
        ? (currentPage.style[BrowserSupport.transform] = `translate${prop}(${
            currentPosition * 100
          }%)${this.fire3D}`)
        : (currentPage.style[this.LT[prop]] = `${currentPosition * 100}%`);
      if (nextPage) {
        BrowserSupport.transform
          ? (nextPage.style[BrowserSupport.transform] = `translate${prop}(${
              nextPosition * 100
            }%)${this.fire3D}`)
          : (nextPage.style[this.LT[prop]] = `${nextPosition * 100}%`);
      }
    };
  }
}

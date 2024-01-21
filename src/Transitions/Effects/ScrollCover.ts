import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { AbstractEffect, Modifier, Name } from "./types";

export class ScrollCover extends Effect implements AbstractEffect {
  public create(name: Name, type: Modifier) {
    return (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      const prop = name || this.XY[this.PW.direction];
      const zIndex = Number(
        type == "In" ||
          (!type && currentPosition < 0) ||
          (type == "Reverse" && currentPosition > 0)
      );
      let cr = 100;
      let tr = 100;
      zIndex ? (cr = 20) : (tr = 20);
      BrowserSupport.transform
        ? (currentPage.style[BrowserSupport.transform] = `translate${prop}(${
            currentPosition * cr
          }%)${this.fire3D}`)
        : (currentPage.style[this.LT[prop]] = `${currentPosition * cr}%`);
      currentPage.style.zIndex = `${1 - zIndex}`;
      if (nextPage) {
        BrowserSupport.transform
          ? (nextPage.style[BrowserSupport.transform] = `translate${prop}(${
              nextPosition * tr
            }%)${this.fire3D}`)
          : (nextPage.style[this.LT[prop]] = `${nextPosition * tr}%`);
        nextPage.style.zIndex = `${zIndex}`;
      }
    };
  }
}

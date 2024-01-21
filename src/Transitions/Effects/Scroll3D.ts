import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name } from "./types";

export class Scroll3D extends Effect implements BaseEffect {
  public create(name: Name) {
    return (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      if (!BrowserSupport.perspective) {
        // @ts-ignore
        return this.instance[`scroll${name}`](arguments);
      }
      const prop = name || this.XY[this.PW.direction];
      const fix = currentPosition < 0 ? -1 : 1;
      const absolutePosition = Math.abs(currentPosition);
      let degrees: number;
      if (absolutePosition < 0.05) {
        degrees = absolutePosition * 1200;
        currentPosition = 0;
        nextPosition = fix * -1;
      } else if (absolutePosition < 0.95) {
        degrees = 60;
        currentPosition = (currentPosition - 0.05 * fix) / 0.9;
        nextPosition = (nextPosition + 0.05 * fix) / 0.9;
      } else {
        degrees = (1 - absolutePosition) * 1200;
        currentPosition = fix;
        nextPosition = 0;
      }
      this.parentNode(currentPage).style[
        BrowserSupport.transform
      ] = `perspective(1000px) rotateX(${degrees}deg)`;
      currentPage.style[BrowserSupport.transform] = `translate${prop}(${
        currentPosition * 100
      }%)`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `translate${prop}(${
          nextPosition * 100
        }%)`;
      }
    };
  }
}

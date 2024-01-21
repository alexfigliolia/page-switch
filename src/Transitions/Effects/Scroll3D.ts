import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name, TransitionParams } from "./types";

export class Scroll3D extends Effect implements BaseEffect {
  public create(name: Name) {
    return (...params: TransitionParams) => {
      if (!BrowserSupport.perspective) {
        return this.instance[`scroll${name}`](...params);
      }
      const [currentPage, currentPosition, nextPage, nextPosition] = params;
      const prop = name || this.XY[this.PW.direction];
      const fix = currentPosition < 0 ? -1 : 1;
      const absolutePosition = Math.abs(currentPosition);
      let degrees: number;
      let currentPos = currentPosition;
      let nextPos = nextPosition;
      if (absolutePosition < 0.05) {
        degrees = absolutePosition * 1200;
        currentPos = 0;
        nextPos = fix * -1;
      } else if (absolutePosition < 0.95) {
        degrees = 60;
        currentPos = (currentPos - 0.05 * fix) / 0.9;
        nextPos = (nextPos + 0.05 * fix) / 0.9;
      } else {
        degrees = (1 - absolutePosition) * 1200;
        currentPos = fix;
        nextPos = 0;
      }
      this.parentNode(currentPage).style[
        BrowserSupport.transform
      ] = `perspective(1000px) rotateX(${degrees}deg)`;
      currentPage.style[BrowserSupport.transform] = `translate${prop}(${
        currentPos * 100
      }%)`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `translate${prop}(${
          nextPos * 100
        }%)`;
      }
    };
  }
}

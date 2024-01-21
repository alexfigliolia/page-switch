import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name } from "./types";

export class Skew extends Effect implements BaseEffect {
  public create(name: Name) {
    return (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      if (!BrowserSupport.transform) {
        // @ts-ignore
        return this.instance[`scroll${name}`](arguments);
      }
      const zIndex = Number(Math.abs(currentPosition) < 0.5);
      currentPage.style[BrowserSupport.transform] = `skew${name}(${
        currentPosition * 180
      }deg)${this.fire3D}`;
      currentPage.style.zIndex = `${zIndex}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `skew${name}(${
          nextPosition * 180
        }deg)${this.fire3D}`;
        nextPage.style.zIndex = `${1 - zIndex}`;
      }
    };
  }
}

import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name } from "./types";

export class Zoom extends Effect implements BaseEffect {
  public create(name: Name) {
    return (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      _nextPosition: number
    ) => {
      if (!BrowserSupport.transform) {
        // @ts-ignore
        return this.instance[`scroll${name}`](arguments);
      }
      const zIndex = Number(Math.abs(currentPosition) < 0.5);
      currentPage.style[BrowserSupport.transform] = `scale${name}(${Math.abs(
        1 - Math.abs(currentPosition) * 2
      )})${this.fire3D}`;
      currentPage.style.zIndex = `${zIndex}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `scale${name}(${Math.abs(
          1 - Math.abs(currentPosition) * 2
        )})${this.fire3D}`;
        nextPage.style.zIndex = `${1 - zIndex}`;
      }
    };
  }
}

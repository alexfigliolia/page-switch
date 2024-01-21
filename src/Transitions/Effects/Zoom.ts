import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name, TransitionParams } from "./types";

export class Zoom extends Effect implements BaseEffect {
  public create(name: Name) {
    return (...params: TransitionParams) => {
      if (!BrowserSupport.transform) {
        return this.instance[`scroll${name}`](...params);
      }
      const [currentPage, currentPosition, nextPage] = params;
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

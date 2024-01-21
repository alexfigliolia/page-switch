import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { AbstractEffect, Modifier, Name } from "./types";

export class SkewCover extends Effect implements AbstractEffect {
  public create(name: Name, type: Modifier) {
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
      const zIndex = Number(
        type == "In" ||
          (!type && currentPosition < 0) ||
          (type == "Reverse" && currentPosition > 0)
      );
      zIndex ? (currentPosition = 0) : (nextPosition = 0);
      currentPage.style[BrowserSupport.transform] = `skew${name}(${
        currentPosition * 90
      }deg)${this.fire3D}`;
      currentPage.style.zIndex = `${1 - zIndex}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `skew${name}(${
          nextPosition * 90
        }deg)${this.fire3D}`;
        nextPage.style.zIndex = `${zIndex}`;
      }
    };
  }
}

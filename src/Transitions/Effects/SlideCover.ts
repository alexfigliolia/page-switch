import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { AbstractEffect, Modifier, Name } from "./types";

export class SlideCover extends Effect implements AbstractEffect {
  public create(name: Name, type: Modifier) {
    return (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      if (!BrowserSupport.transform) {
        // @ts-ignore
        return this.instance[`scrollCover${type}${name}`](arguments);
      }
      const prop = name || ["X", "Y"][this.PW.direction];
      const zIndex = Number(
        type == "In" ||
          (!type && currentPosition < 0) ||
          (type == "Reverse" && currentPosition > 0)
      );
      currentPage.style[BrowserSupport.transform] = `translate${prop}(${
        currentPosition * (100 - zIndex * 100)
      }%) scale(${(1 - Math.abs(zIndex && currentPosition)) * 0.2 + 0.8})${
        this.fire3D
      }`;
      currentPage.style.zIndex = `${1 - zIndex}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `translate${prop}(${
          nextPosition * zIndex * 100
        }%) scale(${(1 - Math.abs(zIndex ? 0 : nextPosition)) * 0.2 + 0.8})${
          this.fire3D
        }`;
        nextPage.style.zIndex = `${zIndex}`;
      }
    };
  }
}

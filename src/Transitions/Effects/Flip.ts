import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name } from "./types";

export class Flip extends Effect implements BaseEffect {
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
      const prop = name || ["X", "Y"][1 - this.PW.direction];
      const fix = prop == "X" ? -1 : 1;
      currentPage.style[BrowserSupport.backfaceVisibility] = "hidden";
      currentPage.style[
        BrowserSupport.transform
      ] = `perspective(1000px) rotate${prop}(${
        currentPosition * 180 * fix
      }deg)${this.fire3D}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.backfaceVisibility] = "hidden";
        nextPage.style[
          BrowserSupport.transform
        ] = `perspective(1000px) rotate${prop}(${nextPosition * 180 * fix}deg)${
          this.fire3D
        }`;
      }
    };
  }
}

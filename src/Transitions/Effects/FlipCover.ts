import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { AbstractEffect, Modifier, Name, TransitionParams } from "./types";

export class FlipCover extends Effect implements AbstractEffect {
  public create(name: Name, type: Modifier) {
    return (...params: TransitionParams) => {
      if (!BrowserSupport.perspective) {
        return this.instance[`scroll${name}`](...params);
      }
      const [currentPage, currentPosition, nextPage, nextPosition] = params;
      const prop = name || this.XY[1 - this.PW.direction];
      const zIndex = Number(
        type == "In" ||
          (!type && currentPosition < 0) ||
          (type == "Reverse" && currentPosition > 0)
      );
      let currentPos = currentPosition;
      let nextPos = nextPosition;
      zIndex ? (currentPos = 0) : (nextPos = 0);
      currentPage.style[
        BrowserSupport.transform
      ] = `perspective(1000px) rotate${prop}(${currentPos * -90}deg)${
        this.fire3D
      }`;
      currentPage.style.zIndex = `${1 - zIndex}`;
      if (nextPage) {
        nextPage.style[
          BrowserSupport.transform
        ] = `perspective(1000px) rotate${prop}(${nextPos * -90}deg)${
          this.fire3D
        }`;
        nextPage.style.zIndex = `${zIndex}`;
      }
    };
  }
}

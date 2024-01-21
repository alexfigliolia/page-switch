import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { AbstractEffect, Name, TransitionParams } from "./types";

export class Flip3D extends Effect implements AbstractEffect {
  private initialized = false;

  public create(name: Name) {
    return (...params: TransitionParams) => {
      if (!BrowserSupport.preserve3D) {
        return this.instance[`scroll${name}`](...params);
      }
      const [currentPage, currentPosition, nextPage] = params;
      const prop = name || ["X", "Y"][1 - this.PW.direction];
      const fe = prop == "X" ? -1 : 1;
      const fix = fe * (currentPosition < 0 ? 1 : -1);
      const zh = currentPage[`offset${prop == "X" ? "Height" : "Width"}`] / 2;
      if (!this.initialized) {
        this.initialized = true;
        this.parentNode(this.parentNode(currentPage)).style[
          BrowserSupport.perspective
        ] = "1000px";
        this.parentNode(currentPage).style[BrowserSupport.transformStyle] =
          "preserve-3d";
      }
      this.parentNode(currentPage).style[
        BrowserSupport.transform
      ] = `translateZ(-${zh}px) rotate${prop}(${currentPosition * 90 * fe}deg)`;
      currentPage.style[
        BrowserSupport.transform
      ] = `rotate${prop}(0) translateZ(${zh}px)`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `rotate${prop}(${
          fix * 90
        }deg) translateZ(${zh}px)`;
      }
    };
  }
}

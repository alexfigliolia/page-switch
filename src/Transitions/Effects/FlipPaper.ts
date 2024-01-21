import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name, TransitionParams } from "./types";

export class FlipPaper extends Effect implements BaseEffect {
  private backDiv: HTMLDivElement | null = null;
  private static hidden =
    "position:absolute;z-index:2;top:0;left:0;height:0;width:0;background:no-repeat #fff;";

  public create(name: Name) {
    return (...params: TransitionParams) => {
      const [, currentPosition, , nextPosition] = params;
      const prop = name || this.XY[this.PW.direction];
      const length = prop == "X" ? "width" : "height";
      const m = Math.abs(currentPosition) * 100;
      if (!this.backDiv) {
        this.backDiv = BrowserSupport.DOC.createElement("div");
        this.backDiv.style.cssText = FlipPaper.hidden;
        try {
          this.backDiv.style.backgroundImage = `${BrowserSupport.CSSVendor}linear-gradient(${this.RB[prop]}, #aaa 0,#fff 20px)`;
        } catch (e) {
          // silence
        }
        this.PW.container.appendChild(this.backDiv);
      }
      // @ts-ignore
      this.instance[`slice${name}`](...params);
      this.backDiv.style.display =
        currentPosition === 0 || nextPosition === 0 ? "none" : "block";
      this.backDiv.style.width = this.backDiv.style.height = "100%";
      this.backDiv.style[length] = `${currentPosition < 0 ? m : 100 - m}%`;
      this.backDiv.style[this.LT[prop]] = `${
        currentPosition < 0 ? 100 - 2 * m : 2 * m - 100
      }%`;
    };
  }
}

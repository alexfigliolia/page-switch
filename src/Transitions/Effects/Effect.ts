import { BrowserSupport } from "BrowserSupport";
import type { Options } from "PageSwitch";
import type { Transitions } from "../Transitions";

export class Effect {
  PW: Options;
  instance: Transitions;
  readonly XY = ["X", "Y"] as const;
  readonly LT = { X: "left", Y: "top" } as const;
  readonly RB = { X: "right", Y: "bottom" } as const;
  readonly fire3D = BrowserSupport.perspective ? " translateZ(0)" : "";
  readonly position =
    "position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden;";
  constructor(PW: Options, instance: Transitions) {
    this.PW = PW;
    this.instance = instance;
  }

  public parentNode(page: HTMLElement) {
    return page.parentNode as HTMLElement;
  }
}

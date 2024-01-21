import { BrowserSupport } from "BrowserSupport";
import type { Options } from "PageSwitch";
import { Register } from "./Register";
import type { ITransitions } from "./types";
import { TransitionFN } from "./Effects";

export class Transitions {
  [key: string]: TransitionFN;
  private static readonly coordinates = ["X", "Y", ""] as const;
  private static readonly modifiers = ["", "Reverse", "In", "Out"] as const;
  public fade(
    currentPage: HTMLElement,
    currentPosition: number,
    nextPage?: HTMLElement,
    _nextPosition?: number
  ) {
    if (BrowserSupport.opacity) {
      currentPage.style.opacity = `${1 - Math.abs(currentPosition)}`;
      if (nextPage) {
        nextPage.style.opacity = `${Math.abs(currentPosition)}`;
      }
      return;
    }
    currentPage.style.filter = `alpha(opacity=${
      (1 - Math.abs(currentPosition)) * 100
    })`;
    if (nextPage) {
      nextPage.style.filter = `alpha(opacity=${
        Math.abs(currentPosition) * 100
      })`;
    }
  }

  public static create(PW: Options) {
    const instance = new Transitions();
    const register = new Register(PW, instance);
    Transitions.coordinates.forEach((name) => {
      instance[`scroll${name}`] = register.Scroll.create(name);
      instance[`scroll3d${name}`] = register.Scroll3D.create(name);
      instance[`slide${name}`] = register.Slide.create(name);
      instance[`flow${name}`] = register.Flow.create(name);
      instance[`slice${name}`] = register.Slice.create(name);
      instance[`flip${name}`] = register.Flip.create(name);
      instance[`flip3d${name}`] = register.Flip3D.create(name);
      instance[`flipClock${name}`] = register.FlipClock.create(name);
      instance[`flipPaper${name}`] = register.FlipPaper.create(name);
      instance[`zoom${name}`] = register.Zoom.create(name);
      instance[`bomb${name}`] = register.Bomb.create(name);
      instance[`skew${name}`] = register.Skew.create(name);
      Transitions.modifiers.forEach((type) => {
        instance[`scrollCover${type}${name}`] = register.ScrollCover.create(
          name,
          type
        );
        instance[`slideCover${type}${name}`] = register.SlideCover.create(
          name,
          type
        );
        instance[`flowCover${type}${name}`] = register.FlowCover.create(
          name,
          type
        );
        instance[`flipCover${type}${name}`] = register.FlipCover.create(
          name,
          type
        );
        instance[`skewCover${type}${name}`] = register.SkewCover.create(
          name,
          type
        );
        instance[`zoomCover${type}${name}`] = register.ZoomCover.create(
          name,
          type
        );
        instance[`bombCover${type}${name}`] = register.BombCover.create(
          name,
          type
        );
      });
    });
    return instance as unknown as ITransitions;
  }
}

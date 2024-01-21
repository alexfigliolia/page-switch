import type { AbstractEffect, BaseEffect, EffectParams } from "./Effects";
import {
  Zoom,
  Flow,
  Flip,
  Bomb,
  Skew,
  Slide,
  Slice,
  Scroll,
  Flip3D,
  Scroll3D,
  FlipClock,
  FlipPaper,
  FlowCover,
  FlipCover,
  ZoomCover,
  SkewCover,
  BombCover,
  SlideCover,
  ScrollCover,
} from "./Effects";

export class Register {
  Flow: BaseEffect;
  Flip: BaseEffect;
  Bomb: BaseEffect;
  Zoom: BaseEffect;
  Skew: BaseEffect;
  Slice: BaseEffect;
  Slide: BaseEffect;
  Scroll: BaseEffect;
  Flip3D: BaseEffect;
  Scroll3D: BaseEffect;
  FlipClock: BaseEffect;
  FlipPaper: BaseEffect;
  FlowCover: AbstractEffect;
  FlipCover: AbstractEffect;
  SkewCover: AbstractEffect;
  ZoomCover: AbstractEffect;
  BombCover: AbstractEffect;
  SlideCover: AbstractEffect;
  ScrollCover: AbstractEffect;
  constructor(...args: EffectParams) {
    this.Flip = new Flip(...args);
    this.Flow = new Flow(...args);
    this.Bomb = new Bomb(...args);
    this.Zoom = new Zoom(...args);
    this.Skew = new Skew(...args);
    this.Slide = new Slide(...args);
    this.Slice = new Slice(...args);
    this.Scroll = new Scroll(...args);
    this.Flip3D = new Flip3D(...args);
    this.Scroll3D = new Scroll3D(...args);
    this.FlipClock = new FlipClock(...args);
    this.FlipPaper = new FlipPaper(...args);
    this.FlowCover = new FlowCover(...args);
    this.FlipCover = new FlipCover(...args);
    this.SkewCover = new SkewCover(...args);
    this.ZoomCover = new ZoomCover(...args);
    this.BombCover = new BombCover(...args);
    this.SlideCover = new SlideCover(...args);
    this.ScrollCover = new ScrollCover(...args);
  }
}

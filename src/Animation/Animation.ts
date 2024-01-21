import { BrowserSupport } from "BrowserSupport";
import type { Nullable } from "Types";

export class Animation {
  lastTime = 0;
  lastTransitionTime = 0;
  lastFrame: Nullable<number> = null;
  currentTime: Nullable<number> = null;
  public nextFrame = this.RAF().bind(BrowserSupport.ROOT);
  public cancelFrame = this.CAF().bind(BrowserSupport.ROOT);

  public cancel() {
    if (this.lastFrame) {
      this.cancelFrame(this.lastFrame);
      this.lastFrame = null;
    }
  }

  public setCurrent() {
    this.currentTime = +new Date();
  }

  public resetCurrent() {
    this.currentTime = null;
  }

  public markTransition(time: number) {
    this.lastTransitionTime = time;
  }

  public get sinceLastTransition() {
    return +new Date() - this.lastTransitionTime;
  }

  private RAF() {
    return (
      BrowserSupport.ROOT.requestAnimationFrame ||
      BrowserSupport.ROOT.webkitRequestAnimationFrame ||
      BrowserSupport.ROOT.mozRequestAnimationFrame ||
      BrowserSupport.ROOT.msRequestAnimationFrame ||
      this.polyfill
    );
  }

  private CAF() {
    return (
      BrowserSupport.ROOT.cancelAnimationFrame ||
      BrowserSupport.ROOT.webkitCancelAnimationFrame ||
      BrowserSupport.ROOT.webkitCancelRequestAnimationFrame ||
      BrowserSupport.ROOT.mozCancelRequestAnimationFrame ||
      BrowserSupport.ROOT.msCancelRequestAnimationFrame ||
      clearTimeout
    );
  }

  private polyfill(callback: (time: number) => void) {
    const currTime = +new Date(),
      delay = Math.max(1000 / 60, 1000 / 60 - (currTime - this.lastTime));
    this.lastTime = currTime + delay;
    return setTimeout(callback, delay);
  }
}

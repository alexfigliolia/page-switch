import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name, TransitionParams } from "./types";

export class FlipClock extends Effect implements BaseEffect {
  public create(name: Name) {
    return (...params: TransitionParams) => {
      if (!BrowserSupport.perspective) {
        return this.instance[`scroll${name}`](...params);
      }
      const [currentPage, currentPosition, nextPage, nextPosition] = params;
      const prop = name || this.XY[1 - this.PW.direction];
      const zIndex = Number(Math.abs(currentPosition) < 0.5);
      const fix = prop == "X" ? 1 : -1;
      this.createWrap(currentPage, this.PW.container, prop, 0);
      this.createWrap(
        currentPage._clone ||
          (currentPage._clone = currentPage.cloneNode(true) as HTMLElement),
        this.PW.container,
        prop,
        0.5
      );
      let n;
      let m = (n = -currentPosition * 180 * fix);
      currentPosition > 0 ? (n = 0) : (m = 0);
      this.parentNode(currentPage).style.zIndex = this.parentNode(
        currentPage._clone
      ).style.zIndex = `${zIndex}`;
      this.parentNode(currentPage).style[
        BrowserSupport.transform
      ] = `perspective(1000px) rotate${prop}(${m}deg)`;
      this.parentNode(currentPage._clone).style[
        BrowserSupport.transform
      ] = `perspective(1000px) rotate${prop}(${n}deg)`;
      if (nextPage) {
        this.createWrap(nextPage, this.PW.container, prop, 0);
        this.createWrap(
          nextPage._clone ||
            (nextPage._clone = nextPage.cloneNode(true) as HTMLElement),
          this.PW.container,
          prop,
          0.5
        );
        m = n = -nextPosition * 180 * fix;
        currentPosition > 0 ? (m = 0) : (n = 0);
        this.parentNode(nextPage).style.zIndex = this.parentNode(
          nextPage._clone
        ).style.zIndex = `${1 - zIndex}`;
        this.parentNode(nextPage).style[
          BrowserSupport.transform
        ] = `perspective(1000px) rotate${prop}(${m}deg)`;
        this.parentNode(nextPage._clone).style[
          BrowserSupport.transform
        ] = `perspective(1000px) rotate${prop}(${n}deg)`;
      }
      this.fixBlock(currentPage, nextPage);
      if (currentPosition === 0 || nextPosition === 0) {
        const visiblePage = this.PW.pages[this.PW.current];
        visiblePage.style.height =
          visiblePage.style.width =
          this.parentNode(visiblePage).style.height =
          this.parentNode(visiblePage).style.width =
            "100%";
        visiblePage.style.top =
          visiblePage.style.left =
          this.parentNode(visiblePage).style.top =
          this.parentNode(visiblePage).style.left =
            `${0}`;
        this.parentNode(visiblePage).style.zIndex = `${2}`;
      }
    };
  }

  private createWrap(
    node: HTMLElement,
    container: HTMLElement,
    prop: "X" | "Y",
    off: number
  ) {
    let wrap = this.parentNode(node);
    const length = prop == "X" ? "height" : "width";
    const position = prop == "X" ? "top" : "left";
    const origin = ["50%", `${off ? 0 : 100}%`]
      [prop == "X" ? "slice" : "reverse"]()
      .join(" ");
    if (!wrap || wrap == container) {
      wrap = BrowserSupport.DOC.createElement("div");
      wrap.style.cssText = `${this.position}display:none;`;
      wrap.style[BrowserSupport.transformOrigin] = origin;
      wrap.style[BrowserSupport.backfaceVisibility] = "hidden";
      wrap.appendChild(node);
      container.appendChild(wrap);
    }
    wrap.style[length] = "50%";
    wrap.style[position] = `${off * 100}%`;
    node.style[length] = "200%";
    node.style[position] = `${-off * 200}%`;
    return wrap;
  }

  private fixBlock(currentPage: HTMLElement, nextPage: HTMLElement) {
    this.PW.pages.forEach((page) => {
      if (page.parentNode == this.PW.container) {
        return;
      }
      if (currentPage != page && nextPage != page) {
        this.parentNode(page).style.display = this.parentNode(
          page._clone!
        ).style.display = "none";
      } else {
        this.parentNode(page).style.display = this.parentNode(
          page._clone!
        ).style.display = "block";
      }
    });
  }
}

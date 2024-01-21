import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name } from "./types";

export class Slice extends Effect implements BaseEffect {
  public create(name: Name) {
    return (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      const prop = name || this.XY[this.PW.direction];
      const length = prop == "X" ? "width" : "height";
      const total: number =
        this.PW.container[
          BrowserSupport.camelCase(`client-${length}`) as "clientHeight"
        ];
      const end = currentPosition == 0 || nextPosition == 0;
      currentPage.style[length] = end ? "100%" : `${total}px`;
      if (currentPage.parentNode == this.PW.container) {
        this.createWrap(currentPage);
      }
      this.parentNode(currentPage).style.zIndex = `${
        currentPosition > 0 ? 0 : 1
      }`;
      this.parentNode(currentPage).style[length] = `${
        (Math.min(currentPosition, 0) + 1) * 100
      }%`;
      if (nextPage) {
        nextPage.style[length] = end ? "100%" : `${total}px`;
        if (nextPage.parentNode == this.PW.container) {
          this.createWrap(nextPage);
        }
        this.parentNode(nextPage).style.zIndex = `${
          currentPosition > 0 ? 1 : 0
        }`;
        this.parentNode(nextPage).style[length] = `${
          (Math.min(nextPosition, 0) + 1) * 100
        }%`;
      }
      this.fixBlock(currentPage, nextPage);
    };
  }

  private createWrap(node: HTMLElement) {
    const wrap = BrowserSupport.DOC.createElement("div");
    wrap.style.cssText = this.position;
    wrap.appendChild(node);
    this.PW.container.appendChild(wrap);
  }

  private fixBlock(currentPage: HTMLElement, nextPage: HTMLElement) {
    this.PW.pages.forEach((page) => {
      if (page.parentNode == this.PW.container) {
        return;
      }
      if (currentPage != page && nextPage != page) {
        this.parentNode(page).style.display = "none";
      } else {
        this.parentNode(page).style.display = "block";
      }
    });
  }
}

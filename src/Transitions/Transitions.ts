import { BrowserSupport } from "BrowserSupport";
import type { Options } from "PageSwitch";
import { TransitionFN } from "./types";
import type { NextTransition, ITransitions } from "./types";

class Transitions {
  [key: string]: TransitionFN;
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
    } else {
      currentPage.style.filter = `alpha(opacity=${
        (1 - Math.abs(currentPosition)) * 100
      })`;
      if (nextPage) {
        nextPage.style.filter = `alpha(opacity=${
          Math.abs(currentPosition) * 100
        })`;
      }
    }
  }
}

export const createTransitions = (PW: Options) => {
  const instance = new Transitions();
  const coordinates = ["X", "Y", ""] as const;

  const parentNode = (page: HTMLElement) => {
    return page.parentNode as HTMLElement;
  };

  coordinates.forEach((name) => {
    const XY = { X: "left", Y: "top" } as const;
    const fire3D = BrowserSupport.perspective ? " translateZ(0)" : "";

    instance[`scroll${name}`] = (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      const prop = name || (["X", "Y"][PW.direction] as "X" | "Y");
      BrowserSupport.transform
        ? (currentPage.style[BrowserSupport.transform] = `translate${prop}(${
            currentPosition * 100
          }%)${fire3D}`)
        : (currentPage.style[XY[prop]] = `${currentPosition * 100}%`);
      if (nextPage) {
        BrowserSupport.transform
          ? (nextPage.style[BrowserSupport.transform] = `translate${prop}(${
              nextPosition * 100
            }%)${fire3D}`)
          : (nextPage.style[XY[prop]] = `${nextPosition * 100}%`);
      }
    };

    instance[`scroll3d${name}`] = (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      if (!BrowserSupport.perspective) {
        // @ts-ignore
        return instance[`scroll${name}`](arguments);
      }
      const prop = name || (["X", "Y"][PW.direction] as "X" | "Y");
      const fix = currentPosition < 0 ? -1 : 1;
      const absolutePosition = Math.abs(currentPosition);
      let degrees: number;
      if (absolutePosition < 0.05) {
        degrees = absolutePosition * 1200;
        currentPosition = 0;
        nextPosition = fix * -1;
      } else if (absolutePosition < 0.95) {
        degrees = 60;
        currentPosition = (currentPosition - 0.05 * fix) / 0.9;
        nextPosition = (nextPosition + 0.05 * fix) / 0.9;
      } else {
        degrees = (1 - absolutePosition) * 1200;
        currentPosition = fix;
        nextPosition = 0;
      }
      parentNode(currentPage).style[
        BrowserSupport.transform
      ] = `perspective(1000px) rotateX(${degrees}deg)`;
      currentPage.style[BrowserSupport.transform] = `translate${prop}(${
        currentPosition * 100
      }%)`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `translate${prop}(${
          nextPosition * 100
        }%)`;
      }
    };

    instance[`slide${name}`] = (...args: Parameters<NextTransition>) => {
      instance[`slideCoverReverse${name}`](...args);
    };

    instance[`flow${name}`] = (...args: Parameters<NextTransition>) => {
      instance[`flowCoverIn${name}`](...args);
    };

    instance[`slice${name}`] = (() => {
      const createWrap = (node: HTMLElement) => {
        const wrap = BrowserSupport.DOC.createElement("div");
        wrap.style.cssText =
          "position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden;";
        wrap.appendChild(node);
        PW.container.appendChild(wrap);
      };
      const fixBlock = (currentPage: HTMLElement, nextPage: HTMLElement) => {
        PW.pages.forEach((page) => {
          if (page.parentNode == PW.container) {
            return;
          }
          if (currentPage != page && nextPage != page) {
            parentNode(page).style.display = "none";
          } else {
            parentNode(page).style.display = "block";
          }
        });
      };
      return (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        nextPosition: number
      ) => {
        const prop = name || (["X", "Y"][PW.direction] as "X" | "Y");
        const length = prop == "X" ? "width" : "height";
        const total: number =
          PW.container[
            BrowserSupport.camelCase(`client-${length}`) as "clientHeight"
          ];
        const end = currentPosition == 0 || nextPosition == 0;
        currentPage.style[length] = end ? "100%" : `${total}px`;
        if (currentPage.parentNode == PW.container) {
          createWrap(currentPage);
        }
        parentNode(currentPage).style.zIndex = `${currentPosition > 0 ? 0 : 1}`;
        parentNode(currentPage).style[length] = `${
          (Math.min(currentPosition, 0) + 1) * 100
        }%`;
        if (nextPage) {
          nextPage.style[length] = end ? "100%" : `${total}px`;
          if (nextPage.parentNode == PW.container) {
            createWrap(nextPage);
          }
          parentNode(nextPage).style.zIndex = `${currentPosition > 0 ? 1 : 0}`;
          parentNode(nextPage).style[length] = `${
            (Math.min(nextPosition, 0) + 1) * 100
          }%`;
        }

        fixBlock(currentPage, nextPage);
      };
    })();

    instance[`flip${name}`] = (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      if (!BrowserSupport.perspective) {
        // @ts-ignore
        return instance[`scroll${name}`](arguments);
      }
      const prop = name || ["X", "Y"][1 - PW.direction];
      const fix = prop == "X" ? -1 : 1;
      currentPage.style[BrowserSupport.backfaceVisibility] = "hidden";
      currentPage.style[
        BrowserSupport.transform
      ] = `perspective(1000px) rotate${prop}(${
        currentPosition * 180 * fix
      }deg)${fire3D}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.backfaceVisibility] = "hidden";
        nextPage.style[
          BrowserSupport.transform
        ] = `perspective(1000px) rotate${prop}(${
          nextPosition * 180 * fix
        }deg)${fire3D}`;
      }
    };

    instance[`flip3d${name}`] = (() => {
      let initialized = false;
      return (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        _nextPosition: number
      ) => {
        if (!BrowserSupport.preserve3D) {
          // @ts-ignore;
          return instance[`scroll${name}`](arguments);
        }
        const prop = name || ["X", "Y"][1 - PW.direction];
        const fe = prop == "X" ? -1 : 1;
        const fix = fe * (currentPosition < 0 ? 1 : -1);
        const zh = currentPage[`offset${prop == "X" ? "Height" : "Width"}`] / 2;
        if (!initialized) {
          initialized = true;
          parentNode(parentNode(currentPage)).style[
            BrowserSupport.perspective
          ] = "1000px";
          parentNode(currentPage).style[BrowserSupport.transformStyle] =
            "preserve-3d";
        }
        parentNode(currentPage).style[
          BrowserSupport.transform
        ] = `translateZ(-${zh}px) rotate${prop}(${
          currentPosition * 90 * fe
        }deg)`;
        currentPage.style[
          BrowserSupport.transform
        ] = `rotate${prop}(0) translateZ(${zh}px)`;
        if (nextPage) {
          nextPage.style[BrowserSupport.transform] = `rotate${prop}(${
            fix * 90
          }deg) translateZ(${zh}px)`;
        }
      };
    })();

    instance[`flipClock${name}`] = (() => {
      const createWrap = (
        node: HTMLElement,
        container: HTMLElement,
        prop: "X" | "Y",
        off: number
      ) => {
        let wrap = parentNode(node);
        const length = prop == "X" ? "height" : "width";
        const position = prop == "X" ? "top" : "left";
        const origin = ["50%", `${off ? 0 : 100}%`]
          [prop == "X" ? "slice" : "reverse"]()
          .join(" ");
        if (!wrap || wrap == container) {
          wrap = BrowserSupport.DOC.createElement("div");
          wrap.style.cssText =
            "position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden;display:none;";
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
      };
      const fixBlock = (currentPage: HTMLElement, nextPage: HTMLElement) => {
        PW.pages.forEach((page) => {
          if (page.parentNode == PW.container) return;
          if (currentPage != page && nextPage != page) {
            parentNode(page).style.display = parentNode(
              page._clone!
            ).style.display = "none";
          } else {
            parentNode(page).style.display = parentNode(
              page._clone!
            ).style.display = "block";
          }
        });
      };
      return (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        nextPosition: number
      ) => {
        if (!BrowserSupport.perspective) {
          // @ts-ignore
          return instance[`scroll${name}`](arguments);
        }
        const prop = name || (["X", "Y"][1 - PW.direction] as "X" | "Y");
        const zIndex = Number(Math.abs(currentPosition) < 0.5);
        const fix = prop == "X" ? 1 : -1;
        let m;
        let n;
        createWrap(currentPage, PW.container, prop, 0);
        createWrap(
          currentPage._clone ||
            (currentPage._clone = currentPage.cloneNode(true) as HTMLElement),
          PW.container,
          prop,
          0.5
        );
        m = n = -currentPosition * 180 * fix;
        currentPosition > 0 ? (n = 0) : (m = 0);
        parentNode(currentPage).style.zIndex = parentNode(
          currentPage._clone
        ).style.zIndex = `${zIndex}`;
        parentNode(currentPage).style[
          BrowserSupport.transform
        ] = `perspective(1000px) rotate${prop}(${m}deg)`;
        parentNode(currentPage._clone).style[
          BrowserSupport.transform
        ] = `perspective(1000px) rotate${prop}(${n}deg)`;
        if (nextPage) {
          createWrap(nextPage, PW.container, prop, 0);
          createWrap(
            nextPage._clone ||
              (nextPage._clone = nextPage.cloneNode(true) as HTMLElement),
            PW.container,
            prop,
            0.5
          );
          m = n = -nextPosition * 180 * fix;
          currentPosition > 0 ? (m = 0) : (n = 0);
          parentNode(nextPage).style.zIndex = parentNode(
            nextPage._clone
          ).style.zIndex = `${1 - zIndex}`;
          parentNode(nextPage).style[
            BrowserSupport.transform
          ] = `perspective(1000px) rotate${prop}(${m}deg)`;
          parentNode(nextPage._clone).style[
            BrowserSupport.transform
          ] = `perspective(1000px) rotate${prop}(${n}deg)`;
        }
        fixBlock(currentPage, nextPage);
        if (0 == currentPosition || nextPosition == 0) {
          currentPage = PW.pages[PW.current];
          currentPage.style.height =
            currentPage.style.width =
            parentNode(currentPage).style.height =
            parentNode(currentPage).style.width =
              "100%";
          currentPage.style.top =
            currentPage.style.left =
            parentNode(currentPage).style.top =
            parentNode(currentPage).style.left =
              `${0}`;
          parentNode(currentPage).style.zIndex = `${2}`;
        }
      };
    })();

    instance[`flipPaper${name}`] = (() => {
      let backDiv: HTMLElement;
      return (
        _currentPage: HTMLElement,
        currentPosition: number,
        _nextPage: HTMLElement,
        nextPosition: number
      ) => {
        const prop = name || (["X", "Y"][PW.direction] as "X" | "Y");
        const length = prop == "X" ? "width" : "height";
        const m = Math.abs(currentPosition) * 100;
        if (!backDiv) {
          backDiv = BrowserSupport.DOC.createElement("div");
          backDiv.style.cssText =
            "position:absolute;z-index:2;top:0;left:0;height:0;width:0;background:no-repeat #fff;";
          try {
            backDiv.style.backgroundImage = `${
              BrowserSupport.CSSVendor
            }linear-gradient(${
              prop == "X" ? "right" : "bottom"
            }, #aaa 0,#fff 20px)`;
          } catch (e) {
            // silence
          }
          PW.container.appendChild(backDiv);
        }
        // @ts-ignore
        instance[`slice${name}`](arguments);
        backDiv.style.display =
          currentPosition == 0 || nextPosition == 0 ? "none" : "block";
        backDiv.style.width = backDiv.style.height = "100%";
        backDiv.style[length] = `${currentPosition < 0 ? m : 100 - m}%`;
        backDiv.style[XY[prop]] = `${
          currentPosition < 0 ? 100 - 2 * m : 2 * m - 100
        }%`;
      };
    })();

    instance[`zoom${name}`] = (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      _nextPosition: number
    ) => {
      if (!BrowserSupport.transform) {
        // @ts-ignore
        return instance[`scroll${name}`](arguments);
      }
      const zIndex = Number(Math.abs(currentPosition) < 0.5);
      currentPage.style[BrowserSupport.transform] = `scale${name}(${Math.abs(
        1 - Math.abs(currentPosition) * 2
      )})${fire3D}`;
      currentPage.style.zIndex = `${zIndex}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `scale${name}(${Math.abs(
          1 - Math.abs(currentPosition) * 2
        )})${fire3D}`;
        nextPage.style.zIndex = `${1 - zIndex}`;
      }
    };

    instance[`bomb${name}`] = (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      _nextPosition: number
    ) => {
      if (!BrowserSupport.transform) {
        // @ts-ignore
        return instance[`scroll${name}`](arguments);
      }
      const zIndex = Number(Math.abs(currentPosition) < 0.5);
      const val = Math.abs(1 - Math.abs(currentPosition) * 2);
      currentPage.style[BrowserSupport.transform] = `scale${name}(${
        2 - val
      })${fire3D}`;
      currentPage.style.opacity = `${zIndex ? val : 0}`;
      currentPage.style.zIndex = `${zIndex}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `scale${name}(${
          2 - val
        })${fire3D}`;
        nextPage.style.opacity = `${zIndex ? 0 : val}`;
        nextPage.style.zIndex = `${1 - zIndex}`;
      }
    };

    instance[`skew${name}`] = (
      currentPage: HTMLElement,
      currentPosition: number,
      nextPage: HTMLElement,
      nextPosition: number
    ) => {
      if (!BrowserSupport.transform) {
        // @ts-ignore
        return instance[`scroll${name}`](arguments);
      }
      const zIndex = Number(Math.abs(currentPosition) < 0.5);
      currentPage.style[BrowserSupport.transform] = `skew${name}(${
        currentPosition * 180
      }deg)${fire3D}`;
      currentPage.style.zIndex = `${zIndex}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `skew${name}(${
          nextPosition * 180
        }deg)${fire3D}`;
        nextPage.style.zIndex = `${1 - zIndex}`;
      }
    };
    " Reverse In Out".split(" ").forEach((type) => {
      instance[`scrollCover${type}${name}`] = (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        nextPosition: number
      ) => {
        const prop = name || (["X", "Y"][PW.direction] as "X" | "Y");
        const zIndex = Number(
          type == "In" ||
            (!type && currentPosition < 0) ||
            (type == "Reverse" && currentPosition > 0)
        );
        let cr = 100;
        let tr = 100;
        zIndex ? (cr = 20) : (tr = 20);
        BrowserSupport.transform
          ? (currentPage.style[BrowserSupport.transform] = `translate${prop}(${
              currentPosition * cr
            }%)${fire3D}`)
          : (currentPage.style[XY[prop]] = `${currentPosition * cr}%`);
        currentPage.style.zIndex = `${1 - zIndex}`;
        if (nextPage) {
          BrowserSupport.transform
            ? (nextPage.style[BrowserSupport.transform] = `translate${prop}(${
                nextPosition * tr
              }%)${fire3D}`)
            : (nextPage.style[XY[prop]] = `${nextPosition * tr}%`);
          nextPage.style.zIndex = `${zIndex}`;
        }
      };

      instance[`slideCover${type}${name}`] = (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        nextPosition: number
      ) => {
        if (!BrowserSupport.transform) {
          // @ts-ignore
          return instance[`scrollCover${type}${name}`](arguments);
        }
        const prop = name || ["X", "Y"][PW.direction];
        const zIndex = Number(
          type == "In" ||
            (!type && currentPosition < 0) ||
            (type == "Reverse" && currentPosition > 0)
        );
        currentPage.style[BrowserSupport.transform] = `translate${prop}(${
          currentPosition * (100 - zIndex * 100)
        }%) scale(${
          (1 - Math.abs(zIndex && currentPosition)) * 0.2 + 0.8
        })${fire3D}`;
        currentPage.style.zIndex = `${1 - zIndex}`;
        if (nextPage) {
          nextPage.style[BrowserSupport.transform] = `translate${prop}(${
            nextPosition * zIndex * 100
          }%) scale(${
            (1 - Math.abs(zIndex ? 0 : nextPosition)) * 0.2 + 0.8
          })${fire3D}`;
          nextPage.style.zIndex = `${zIndex}`;
        }
      };

      instance[`flowCover${type}${name}`] = (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        nextPosition: number
      ) => {
        if (!BrowserSupport.transform) {
          // @ts-ignore
          return instance[`scrollCover${type}${name}`](arguments);
        }
        const prop = name || ["X", "Y"][PW.direction];
        const zIndex = Number(
          type == "In" ||
            (!type && currentPosition < 0) ||
            (type == "Reverse" && currentPosition > 0)
        );
        currentPage.style[BrowserSupport.transform] = `translate${prop}(${
          currentPosition * (100 - zIndex * 50)
        }%) scale(${(1 - Math.abs(currentPosition)) * 0.5 + 0.5})${fire3D}`;
        currentPage.style.zIndex = `${1 - zIndex}`;
        if (nextPage) {
          nextPage.style[BrowserSupport.transform] = `translate${prop}(${
            nextPosition * (50 + zIndex * 50)
          }%) scale(${(1 - Math.abs(nextPosition)) * 0.5 + 0.5})${fire3D}`;
          nextPage.style.zIndex = `${zIndex}`;
        }
      };

      instance[`flipCover${type}${name}`] = (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        nextPosition: number
      ) => {
        if (!BrowserSupport.perspective) {
          // @ts-ignore
          return instance[`scroll${name}`](arguments);
        }
        const prop = name || ["X", "Y"][1 - PW.direction];
        const zIndex = Number(
          type == "In" ||
            (!type && currentPosition < 0) ||
            (type == "Reverse" && currentPosition > 0)
        );
        zIndex ? (currentPosition = 0) : (nextPosition = 0);
        currentPage.style[
          BrowserSupport.transform
        ] = `perspective(1000px) rotate${prop}(${
          currentPosition * -90
        }deg)${fire3D}`;
        currentPage.style.zIndex = `${1 - zIndex}`;
        if (nextPage) {
          nextPage.style[
            BrowserSupport.transform
          ] = `perspective(1000px) rotate${prop}(${
            nextPosition * -90
          }deg)${fire3D}`;
          nextPage.style.zIndex = `${zIndex}`;
        }
      };

      instance[`skewCover${type}${name}`] = (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        nextPosition: number
      ) => {
        if (!BrowserSupport.transform) {
          // @ts-ignore
          return instance[`scroll${name}`](arguments);
        }
        const zIndex = Number(
          type == "In" ||
            (!type && currentPosition < 0) ||
            (type == "Reverse" && currentPosition > 0)
        );
        zIndex ? (currentPosition = 0) : (nextPosition = 0);
        currentPage.style[BrowserSupport.transform] = `skew${name}(${
          currentPosition * 90
        }deg)${fire3D}`;
        currentPage.style.zIndex = `${1 - zIndex}`;
        if (nextPage) {
          nextPage.style[BrowserSupport.transform] = `skew${name}(${
            nextPosition * 90
          }deg)${fire3D}`;
          nextPage.style.zIndex = `${zIndex}`;
        }
      };

      instance[`zoomCover${type}${name}`] = (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        nextPosition: number
      ) => {
        if (!BrowserSupport.transform) {
          // @ts-ignore
          return instance[`scroll${name}`](arguments);
        }
        const zIndex = Number(
          type == "In" ||
            (!type && currentPosition < 0) ||
            (type == "Reverse" && currentPosition > 0)
        );
        zIndex ? (currentPosition = 0) : (nextPosition = 0);
        currentPage.style[BrowserSupport.transform] = `scale${name}(${
          1 - Math.abs(currentPosition)
        })${fire3D}`;
        currentPage.style.zIndex = `${1 - zIndex}`;
        if (nextPage) {
          nextPage.style[BrowserSupport.transform] = `scale${name}(${
            1 - Math.abs(nextPosition)
          })${fire3D}`;
          nextPage.style.zIndex = `${zIndex}`;
        }
      };

      instance[`bombCover${type}${name}`] = (
        currentPage: HTMLElement,
        currentPosition: number,
        nextPage: HTMLElement,
        nextPosition: number
      ) => {
        if (!BrowserSupport.transform) {
          // @ts-ignore
          return instance[`scroll${name}`](arguments);
        }
        const zIndex = Number(
          type == "In" ||
            (!type && currentPosition < 0) ||
            (type == "Reverse" && currentPosition > 0)
        );
        zIndex ? (currentPosition = 0) : (nextPosition = 0);
        currentPage.style[BrowserSupport.transform] = `scale${name}(${
          1 + Math.abs(currentPosition)
        })${fire3D}`;
        currentPage.style.zIndex = `${1 - zIndex}`;
        if (nextPage) {
          nextPage.style[BrowserSupport.transform] = `scale${name}(${
            1 + Math.abs(nextPosition)
          })${fire3D}`;
          nextPage.style.zIndex = `${zIndex}`;
        }
        // @ts-ignore
        instance.fade(arguments);
      };
    });
  });
  return instance as unknown as ITransitions;
};

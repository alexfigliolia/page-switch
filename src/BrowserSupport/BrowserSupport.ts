export class BrowserSupport {
  public static readonly ROOT = typeof window === "undefined" ? global : window;
  public static readonly DOC = this.ROOT.document;
  public static passive = this.testPassive();
  public static readonly DIVStyle = this.DOC.createElement("div").style;
  public static readonly CSSVendor = this.parseVendor();
  public static readonly opacity = this.CSSTest("opacity", "opacity");
  public static readonly transform = this.CSSTest("transform", "transform");
  public static readonly perspective = this.CSSTest(
    "perspective",
    "perspective"
  );
  public static readonly transformStyle = this.CSSTest(
    "transform-style",
    "transformStyle"
  );
  public static readonly transformOrigin = this.CSSTest(
    "transform-origin",
    "transformOrigin"
  );
  public static readonly backfaceVisibility = this.CSSTest(
    "backface-visibility",
    "backfaceVisibility"
  );
  public static readonly preserve3D = this.detectPreserve3D();
  public static readonly CLASS_TO_TYPE = this.mapTypes();

  private static parseVendor() {
    let prop: string | undefined;
    const tests = "-webkit- -moz- -o- -ms-".split(" ");
    while ((prop = tests.shift())) {
      if (this.camelCase(`${prop}transform`) in this.DIVStyle) {
        return prop;
      }
    }
    return "";
  }

  private static CSSTest<T extends keyof CSSStyleDeclaration>(
    name: string,
    _declaration: T
  ) {
    const prop = this.camelCase(name);
    const _prop = this.camelCase(this.CSSVendor + prop);
    return ((prop in this.DIVStyle && prop) ||
      (_prop in this.DIVStyle && _prop) ||
      "") as T;
  }

  private static detectPreserve3D() {
    if (this.transformStyle) {
      this.DIVStyle[this.transformStyle] = "preserve-3d";
      return true;
    }
    return false;
  }

  public static camelCase(str: string) {
    return `${str}`
      .replace(/^-ms-/, "ms-")
      .replace(/-([a-z]|[0-9])/gi, (_, letter: string) => {
        return `${letter}`.toUpperCase();
      });
  }

  public static getStyle(
    element: HTMLElement,
    prop: string & keyof CSSStyleDeclaration
  ) {
    const style =
      (this.ROOT.getComputedStyle &&
        this.ROOT.getComputedStyle(element, null)) ||
      // @ts-ignore
      element.currentStyle ||
      element.style;
    return style[prop] as string;
  }

  private static mapTypes() {
    const map: Record<string, string> = {};
    this.constructors.forEach((name) => {
      map[`[object ${name}]`] = name.toLowerCase();
    });
    return map;
  }

  private static get constructors() {
    return [
      "Boolean",
      "Number",
      "String",
      "Function",
      "Array",
      "Date",
      "RegExp",
      "Object",
      "Error",
    ];
  }

  private static testPassive() {
    let supportsPassive: boolean | { passive: boolean } = false;
    try {
      const opts = Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = { passive: true };
        },
      });
      this.ROOT.addEventListener("testPassive", () => {}, opts);
    } catch (e) {
      //silence
    }
    return supportsPassive;
  }
}

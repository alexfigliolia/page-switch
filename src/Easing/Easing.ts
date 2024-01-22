export class Easing {
  public static linear(t: number, b: number, c: number, d: number) {
    return (c * t) / d + b;
  }

  public static ease(t: number, b: number, c: number, d: number) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }

  public static "ease-in"(t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t * t + b;
  }

  public static "ease-out"(t: number, b: number, c: number, d: number) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  }

  public static "ease-in-out"(t: number, b: number, c: number, d: number) {
    if ((t /= d / 2) < 1) {
      return (c / 2) * t * t * t + b;
    }
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  }

  public static bounce(t: number, b: number, c: number, d: number) {
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b;
    }
    if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    }
    if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    }
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  }
}

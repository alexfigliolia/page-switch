# Page Switch
A slider animation library supporting
1. Drag, pointer, touch, mouse, and scroll events
2. More than 50 built-in animations and visual variations
3. Any frontend framework and/or vanilla JS

### Installation
```bash
npm i @figliolia/page-switch
# or
yarn add @figliolia/page-switch
```

### Basic Usage
To create your slider, grab a reference to your container element or its ID and pass it to the `PageSwitch` constructor with the options you want to use:
```typescript
import { PageSwitch } from "@figliolia/page-switch";

const Switcher = new PageSwitch("<container element or ID>", {
  duration: 750, // animation duration when scrolling or swiping
  direction: 1, // Horizontal (0) or Vertical (1)
  transition: "slide", // Which animation to use
  start: 0, // Which index to display first
  loop: true, // Whether your pages should loop or end when your last page is reached
  mousewheel: true, // Whether to enable mouse wheel scrolling
  mouse: true, // Whether to enable dragging with your mouse
  arrowKey: true, // Whether to enable animating using your directional keys
  autoplay: false // Whether to allow the slider to animate freely
  ease: "linear" // The name of a built-in easing function or an easing function of your own
});
```
Upon creating your instance, the `PageSwitch` class will take care of positioning your container and children elements so that they transition smoothly.

### The API
The `PageSwitch` interface also provides a handful of public methods for you to more easily control your slider programmatically:
#### PageSwitch.play();
The play method will trigger the auto-play feature and begin transition between your pages in order using the `interval` you passed as an option. This `interval` can be adjusted on the fly by simply assigning it a new value:
```typescript
const PW = new PageSwitch(/* options */);
PW.setInterval(5000);
```

#### PageSwitch.pause()
The pause method will stop the auto-play feature when in use. It can be resumed again be calling the `play()` method or by calling `setInterval()` with a new value

#### PageSwitch.previous()
Moves the slider to the previous slide

#### PageSwitch.next()
Moves the slider to the next slide

#### PageSwitch.freeze()
This method will pause all activity to the slider - including events invoked by dragging and scrolling

#### PageSwitch.destroy()
This method can be used to clean up your `PageSwitch` instance

#### PageSwitch.append(element: HTMLElement, index?: number)
Appends new elements to your slider at the specified position. When omitting the `index` parameter, the new element will be placed in the last position

#### PageSwitch.prepend(element: HTMLElement)
Appends a new element to your slider in the zeroth position

#### PageSwitch.insertBefore(element: HTMLElement, index)
Places a new element before the specified index

#### PageSwitch.insertAfter(element: HTMLElement, index)
Places a new element after the specified index

#### PageSwitch.remove(index: number)
Removes the child at the specified index

#### PageSwitch.setInterval(milliseconds: number) 
Sets the amount of time the slider should remain on any given page when using the auto-play feature. When setting the interval, the auto-play will begin running if not already. If you'd like to set the interval without beginning the auto play feature, you can assign the interval a new value using `PageSwitch.interval = <your value>`

#### PageSwitch.setEasing(easing: EasingString | EasingFN);
Updates the easing function used to transition between slides. Valid built-in easing functions are:
1. "linear"
2. "ease"
3. "ease-in"
4. "ease-out"
5. "ease-in-out"
6. "bounce"

To add your own custom easing functions, pass in any valid bezier easing function: 
`(t: number, b: number, c: number, d: number) => number`

#### PageSwitch.setTransition(transition: Transition | TransitionFN)
This method will allow you to swap animations on the fly for any reason - like if the browser resizes or a user prefers reduced motion. You may also pass in a transition function of your own if you wish to customize your `PageSwitch` visuals. Transition functions work in accordance with the following syntax:

```typescript
const myTransitionFN = (
  currentPage: HTMLElement, // the currently visible page element
  currentPosition: number, // the transition progress of the current element
  nextPage?: HTMLElement, // the next element - either ahead or behind the current depending on the user's gesturing
  nextPosition?: number // the transition progress of the next element
) => {
  // Operations on your DOM elements
  // To transition opacity, one might do the following:
  currentPage.style.opacity = `${1 - Math.abs(currentPosition)}`;
  if (nextPage) {
    nextPage.style.opacity = `${Math.abs(currentPosition)}`;
  }
};
```
In the above example, you may have noticed the reference check on the `nextPage` element. For most sliders, which loop back to the first element when reaching the end, the `nextPage` and `nextPosition` parameters will never be undefined. However, if the user chooses to not set the `loop` option to `true`, transitioning beyond the last element is disabled and these parameters will be `undefined` in these cases.

### Events
Your `PageSwitch` instance will emit the following events allowing you to coordinate customized visual logic with `PageSwitch's` internals:
#### Before
An event fired the moment before a page transitions to the following page

```typescript
const PW = new PageSwitch(/* options */);

PW.on("before", (currentIndex: number, nextIndex: number) => {
  // Execute your logic!
});
```

#### After
An event fired immediately after a page transitions to the following page

```typescript
const PW = new PageSwitch(/* options */);

PW.on("after", (currentIndex: number, previousIndex: number) => {
  // Execute your logic!
});
```

#### Update
An event fired on each frame containing each transition function parameter

```typescript
const PW = new PageSwitch(/* options */);

PW.on("update", (
  currentPage: HTMLElement, 
  currentPosition: number,
  nextPage?: HTMLElement,
  nextPosition?: number
) => {
  // Create cool parallax effects! 
  // Keep in mind, this event will fire at 60 FPS
});
```

#### Drag Start
An event fired at the beginning of each drag

```typescript
const PW = new PageSwitch(/* options */);

PW.on("dragStart", (event: DragEvent) => {
  // Execute your logic
});
```

#### Drag Move
An event fired on each drag movement

```typescript
const PW = new PageSwitch(/* options */);

PW.on("dragMove", (event: DragEvent) => {
  // Execute your logic
});
```

#### Drag End
An event fired on the end of each drag

```typescript
const PW = new PageSwitch(/* options */);

PW.on("dragEnd", (event: DragEvent) => {
  // Execute your logic
});
```

### Demo
I'm sure the moment most readers have been waiting for. Here's a [really cool demo](https://github.boy.im/pageSwitch/pic.html) created by the original author @qiqiboy.

If you're wondering why I decided to rewrite the original library please read on.

The author who created this library did so over ten years ago - dealing with all of the nuanced browser incompatibilities. In spite of this, it's one of the best open-source slider animation libraries in existence. The library never relied on JQuery or any other framework that may bloat its size - or would make standardizing it across browsers easier. The original author really knew his stuff.

Over time, there began to be some browser compatibility issues as certain legacy API's began to be phased out. Because the original author has since moved on, and I used this library in a ton of client websites and apps back in the day, I felt the desire to fix the incoming issues as well as try to modernize it a bit for new projects.

I've used this library with Svelte, React, Vue - just about every modern framework and it continues to hold up nicely. If you wish to check out the original, it can be found [here.](https://github.com/qiqiboy/pageSwitch).






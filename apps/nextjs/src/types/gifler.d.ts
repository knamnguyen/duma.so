declare module "gifler" {
  interface GiflerAnimation {
    stop(): void;
  }

  interface GiflerInstance {
    animate(canvas: HTMLCanvasElement): GiflerAnimation;
    frames(
      canvas: HTMLCanvasElement,
      callback: (ctx: CanvasRenderingContext2D, frame: any) => void,
    ): void;
  }

  function gifler(url: string): GiflerInstance;
  export default gifler;
}

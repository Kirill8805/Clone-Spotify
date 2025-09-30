declare module "fast-average-color" {
  export interface FastAverageColorResult {
    value: [number, number, number, number];
    rgb: string;
    rgba: string;
    hex: string;
    isDark: boolean;
    isLight: boolean;
  }

  export class FastAverageColor {
    getColorAsync(
      source: HTMLImageElement | string,
      options?: { crossOrigin?: string }
    ): Promise<FastAverageColorResult>;
  }
}

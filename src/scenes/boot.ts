import Phaser from "phaser";
import { makeTextures } from "../textures.ts";
import { loadSounds } from "../sounds.ts";

export const FADE_MS = 450;
export const FADE_COLOR = [4, 2, 12] as const;

/**
 * Shared transition helper that fades out and switches to the target scene.
 * Safely ignores duplicate requests if a fade is already in progress.
 */
export function fadeTo(
  scene: Phaser.Scene,
  target: string,
  data?: object,
  callback?: () => void,
): void {
  const s = scene as unknown as { leaving?: boolean };
  if (s.leaving) return;
  s.leaving = true;
  callback?.();
  const camera = scene.cameras.main;
  camera.fadeOut(FADE_MS, FADE_COLOR[0], FADE_COLOR[1], FADE_COLOR[2]);
  camera.once("camerafadeoutcomplete", () => {
    s.leaving = false;
    scene.scene.start(target, data);
  });
}

/** Pre-generates textures and sounds before starting the title screen. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create(): void {
    makeTextures(this);
    loadSounds(this);
    this.scene.start("title");
  }
}

export const cameraPos = {
  top: { x: 0, y: 0, z: 15.6, rx: 0.05, ry: 0 },
  about: { x: 0, y: 0.5, z: 13.6, rx: 0.02 },
  transition01: { x: 0, y: 1.5, z: 17, rx: -0.02 },
  works01: { x: 0, y: 0, z: 20, rx: 0.06 },
  works02: { x: 0, y: 0, z: 23, rx: 0.06 },
  transition02: { x: 0, y: 0, z: 23, rx: 0.06 },
  contact: { x: 0, y: -2.5, z: 16, rx: 0.2 },
};

export type Section = keyof typeof cameraPos;

export const mobileCameraPos = {
  top: { x: 0, y: -0.6, z: 10.7, rx: 0.13 },
  about: { x: -0.1, y: -0.2, z: 11, rx: -0.06 },
  transition01: { x: 0, y: -0.2, z: 15, rx: -0.05 },
  works01: { x: 0, y: 0, z: 30, rx: -0.02 },
  works02: { x: 0, y: 0, z: 32, rx: -0.02 },
  transition02: { x: 0, y: 0, z: 32, rx: 0.02 },
  contact: { x: 0, y: -2, z: 18, rx: 0.1 },
};

export type MobileSection = keyof typeof mobileCameraPos;

export const SECTION_RANGES = [
  { threshold: 0.1, name: "top" },
  { threshold: 0.3, name: "about" },
  { threshold: 0.4, name: "transition01" },
  { threshold: 0.6, name: "works01" },
  { threshold: 0.7, name: "works02" },
  { threshold: 0.8, name: "transition02" },
  { threshold: Infinity, name: "contact" },
];

export const EFFECT_RANGES = [
  { threshold: 0.3, name: "firstHalf" },
  { threshold: 0.4, name: "transition01" },
  { threshold: 0.7, name: "secondHalf01" },
  { threshold: 0.8, name: "transition02" },
  { threshold: Infinity, name: "secondHalf02" },
];

export const SECTION_START_POS = {
  top: 0,
  about: 0.1,
  works: 0.4,
  contact: 0.8,
};

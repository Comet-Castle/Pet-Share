import { formObjects } from "./forms";
import { petObjects } from "./pet";
import { sectionObjects } from "./sections";
import { sharedObjects } from "./shared";

export const objectTypes = [
  ...sharedObjects,
  ...sectionObjects,
  ...petObjects,
  ...formObjects
];

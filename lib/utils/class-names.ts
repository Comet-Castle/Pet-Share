/**
 * Joins conditional class names while filtering empty values.
 */
export function joinClassNames(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

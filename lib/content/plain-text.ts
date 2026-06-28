type PortableTextSpan = Readonly<{
  text?: string;
}>;

type PortableTextBlock = Readonly<{
  children?: PortableTextSpan[];
}>;

/**
 * Converts basic Portable Text blocks into plain text for skeleton rendering.
 */
export function portableTextToPlainText(blocks: PortableTextBlock[] | null | undefined) {
  return (
    blocks
      ?.map((block) => block.children?.map((child) => child.text).filter(Boolean).join(""))
      .filter(Boolean)
      .join("\n\n") ?? ""
  );
}

import Link from "next/link";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";

type RichTextProps = Readonly<{
  value: unknown[] | null | undefined;
}>;

const richTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-7 text-pet-muted">{children}</p>,
    h2: ({ children }) => <h2 className="font-display text-3xl font-bold text-pet-ink">{children}</h2>,
    h3: ({ children }) => <h3 className="font-display text-2xl font-bold text-pet-ink">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-pet-coral pl-5 font-display text-2xl font-bold text-pet-ink">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-2 pl-5 text-pet-muted">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-2 pl-5 text-pet-muted">{children}</ol>
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1 leading-6">{children}</li>,
    number: ({ children }) => <li className="pl-1 leading-6">{children}</li>
  },
  marks: {
    textLink: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "/";
      const isExternal = href.startsWith("http");

      return (
        <Link
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          className="font-bold text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
        >
          {children}
        </Link>
      );
    }
  }
};

/**
 * Renders Sanity Portable Text with Pet Share typography and link handling.
 */
export function RichText({ value }: RichTextProps) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <PortableText value={value as PortableTextBlock[]} components={richTextComponents} />
    </div>
  );
}

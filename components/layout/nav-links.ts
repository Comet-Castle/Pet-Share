import { stegaClean } from "@sanity/client/stega";

export type NavigationLink = Readonly<{
  label: string;
  link: {
    type: "action" | "externalUrl" | "internalPath" | null;
    path: string | null;
    url: string | null;
    openInNewTab: boolean | null;
  };
}>;

export type ResolvedNavLink = Readonly<{
  label: string;
  href: string;
  external: boolean;
}>;

/**
 * Resolves CMS navigation links into renderable hrefs. Action links (drawer/form
 * triggers) and internal links with no path have no valid destination in the
 * site chrome, so they are dropped instead of rendering a dead `href="/"`.
 *
 * Kept in a plain (non-client) module so both the server shell and the client
 * nav component can call it.
 */
export function resolveNavLinks(items: readonly NavigationLink[]): ResolvedNavLink[] {
  return items.flatMap((item) => {
    const type = stegaClean(item.link.type);

    if (type === "externalUrl") {
      const url = item.link.url;
      return url ? [{ label: item.label, href: url, external: true }] : [];
    }

    if (type === "action") {
      // Drawer/form actions are not navigable destinations; omit from chrome.
      return [];
    }

    const path = item.link.path;
    if (!path) {
      return [];
    }

    return [{ label: item.label, href: path, external: item.link.openInNewTab === true }];
  });
}

/**
 * Returns true when `href` matches the current path exactly, or is a section
 * root the current path lives under (so `/pets/rex` still marks `/pets` active).
 */
export function isActiveNavLink(pathname: string, href: string): boolean {
  if (!href.startsWith("/")) {
    return false;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

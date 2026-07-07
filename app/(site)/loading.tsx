import { WhimsicalLoader } from "@/components/layout/whimsical-loader";

/**
 * Public route loading state. The shell (nav/footer) stays mounted from the
 * layout, so this only fills the main content area. Most routes rarely show this
 * state, so it uses a delightful centered whimsical loader rather than a
 * layout-accurate skeleton. Accepted tradeoff: the loader does not preserve
 * layout, so real content reflows in when it swaps — fine for briefly-seen routes.
 * The `/pets` index, which re-triggers loading on every filter change, has its own
 * grid-shaped `loading.tsx` so it does not flash this centered loader repeatedly.
 */
export default function SiteLoading() {
  return <WhimsicalLoader />;
}

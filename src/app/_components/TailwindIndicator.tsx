/**
 * Helper component to show the current Tailwind breakpoint.
 *
 * Source: https://github.com/shadcn-ui/ui/blob/main/apps/www/components/tailwind-indicator.tsx
 */
export default function TailwindIndicator() {
  return (
    <div className="bg-primary-electric-neon-200 fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-blue-800 p-3 font-mono text-xs text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}

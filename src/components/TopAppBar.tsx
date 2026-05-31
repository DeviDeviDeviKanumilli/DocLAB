import { Icon } from "./Icon";

export function TopAppBar({
  title,
  showSearch = false,
}: {
  title?: string;
  showSearch?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-8">
      <div className="flex items-center gap-4">
        {showSearch ? (
          <div className="relative hidden sm:block">
            <Icon
              name="search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled"
            />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-64 rounded border border-border bg-background py-1.5 pl-10 pr-4 font-body-md text-body-md placeholder:text-text-disabled focus:border-outline focus:outline-none transition-colors"
            />
          </div>
        ) : (
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded border border-border bg-background px-4 py-1.5 font-headline-md text-headline-md text-text-primary">
          <Icon name="encrypted" size={18} />
          Local only
        </div>
        <div className="mx-1 h-6 w-px bg-border" />
        <div className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary">
          <Icon name="notifications_off" size={20} />
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary">
          <Icon name="account_circle" size={20} />
        </div>
      </div>
    </header>
  );
}

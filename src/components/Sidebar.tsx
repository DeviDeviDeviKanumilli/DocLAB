import { Icon } from "./Icon";
import { useRouter, type Route } from "../router";

interface NavItem {
  route: Route;
  label: string;
  icon: string;
}

const PRIMARY: NavItem[] = [
  { route: "home", label: "New Prototype", icon: "add_box" },
  { route: "experiments", label: "Experiments", icon: "science" },
  { route: "datasets", label: "Datasets", icon: "database" },
  { route: "models", label: "Models", icon: "model_training" },
  { route: "settings", label: "Settings", icon: "settings" },
];

export function Sidebar() {
  const { route, navigate } = useRouter();

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden h-screen w-[220px] flex-col border-r border-border bg-background md:flex">
        {/* Brand */}
        <div className="flex items-center gap-3 p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Icon name="biotech" size={20} />
          </div>
          <div className="leading-tight">
            <h1 className="font-headline-md text-headline-md tracking-tight text-primary">
              DocLab
            </h1>
            <p className="font-label-sm text-label-sm text-text-muted">
              Healthcare ML
            </p>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="px-4 pb-4">
          <button
            onClick={() => navigate("home")}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-headline-md text-headline-md text-on-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-inverse-surface hover:shadow-md active:translate-y-0 active:scale-[0.98]"
          >
            <Icon name="add" size={18} className="transition-transform duration-300 group-hover:rotate-90" />
            New Prototype
          </button>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {PRIMARY.map((item) => {
            const active = route === item.route;
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`group relative flex w-full items-center gap-3 rounded-full px-3 py-2 text-left transition-all duration-300 ease-out active:scale-[0.98] ${
                  active
                    ? "bg-surface-container font-semibold text-primary"
                    : "text-text-muted hover:translate-x-0.5 hover:bg-surface-container/60 hover:text-text-secondary"
                }`}
              >
                {/* Animated active accent bar */}
                <span
                  className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary transition-transform duration-300 ease-out ${
                    active ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <Icon
                  name={item.icon}
                  size={20}
                  fill={active}
                  className="transition-transform duration-300 ease-out group-hover:scale-110"
                />
                <span className="font-body-md text-body-md">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Safety footer */}
        <div className="mt-auto border-t border-border p-4">
          <div className="flex items-start gap-3 rounded-lg bg-surface-container px-3 py-2 text-text-muted">
            <Icon name="verified_user" size={20} />
            <p className="font-label-sm text-label-sm">
              Public data only. Research prototypes stay local.
            </p>
          </div>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-border bg-background md:hidden">
        {PRIMARY.map((item) => {
          const active = route === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-[10px] leading-tight transition-colors ${
                active ? "text-primary" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <Icon name={item.icon} size={20} fill={active} />
              <span className="w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

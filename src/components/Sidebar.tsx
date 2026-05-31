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

const FOOTER = [
  { label: "Documentation", icon: "description" },
  { label: "Support", icon: "help" },
];

export function Sidebar() {
  const { route, navigate } = useRouter();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex w-[220px] h-screen flex-col border-r border-border bg-background">
      {/* Brand */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
          <Icon name="biotech" size={20} />
        </div>
        <div className="leading-tight">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">
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
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-full py-2.5 font-headline-md text-headline-md transition-all hover:bg-inverse-surface active:scale-[0.98]"
        >
          <Icon name="add" size={18} />
          New Prototype
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {PRIMARY.map((item) => {
          const active = route === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-full text-left transition-all active:scale-[0.98] ${
                active
                  ? "bg-surface-container text-primary font-semibold"
                  : "text-text-muted hover:bg-surface-container hover:text-text-secondary"
              }`}
            >
              <Icon name={item.icon} size={20} fill={active} />
              <span className="font-body-md text-body-md">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer nav */}
      <div className="mt-auto p-3 border-t border-border space-y-1">
        {FOOTER.map((item) => (
          <a
            key={item.label}
            className="flex items-center gap-3 px-3 py-2 rounded-full text-text-muted hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Icon name={item.icon} size={20} />
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

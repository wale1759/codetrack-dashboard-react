import {
  ChartColumn,
  GraduationCap,
  LayoutGrid,
  Settings,
  SquarePen,
  Target,
} from "lucide-react";

// Items without a `to` route are not implemented yet; nav components render
// those as disabled stubs. Extend this list as new pages ship.
export const DASHBOARD_NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", to: "/", Icon: LayoutGrid },
  { key: "log", label: "Log", to: "/log", Icon: SquarePen },
  { key: "goals", label: "Goals", Icon: Target },
  { key: "skills", label: "Skills", Icon: GraduationCap },
  { key: "stats", label: "Stats", Icon: ChartColumn },
  { key: "settings", label: "Settings", Icon: Settings },
];

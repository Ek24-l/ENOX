
import {
  LayoutDashboard,
  Lightbulb,
  Activity,
  Settings,
  Menu,
  X,
  Sun,
} from "lucide-react";

function Sidebar({
  section,
  setSection,
  sidebarOpen,
  setSidebarOpen,
  theme,
}) {
  const menuItems = [
    { name: "Inicio", icon: LayoutDashboard },
    { name: "Luminarias", icon: Lightbulb },
    { name: "Monitoreo", icon: Activity },
    { name: "Configuración", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen ${
        sidebarOpen ? "w-64" : "w-20"
      } p-4 flex flex-col transition-all duration-300 z-50`}
      style={{
        backgroundColor: theme.primary,
        color: "#FFFFFF",
      }}
    >
      {/* ENCABEZADO */}
      <div className="relative flex items-center justify-center mb-10 min-h-10">

        {sidebarOpen && (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold flex items-center gap-0.5">
            EN
            <Sun size={23} strokeWidth={2.2} />
            X
          </h1>
        )}

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/20 transition ml-auto"
          aria-label="Abrir o cerrar menú"
        >
          {sidebarOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = section === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setSection(item.name)}
              className="flex items-center gap-3 p-3 rounded-xl text-left transition"
              style={{
                backgroundColor: active
                  ? theme.secondary
                  : "transparent",
                color: "#FFFFFF",
              }}
              title={!sidebarOpen ? item.name : ""}
            >
              <Icon size={21} />

              {sidebarOpen && (
                <span className="font-medium">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* PIE DE BARRA LATERAL */}
      {sidebarOpen && (
        <div className="mt-auto text-xs text-white/70">
          Sistema de alumbrado inteligente
        </div>
      )}
    </aside>
  );
}

export default Sidebar;

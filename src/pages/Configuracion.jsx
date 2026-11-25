
import { Palette, Check, Paintbrush, Lightbulb } from "lucide-react";

function Configuracion({
  selectedPalette,
  setSelectedPalette,
  palettes,
  theme,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: theme.text }}
        >
          Configuración
        </h1>

        <p className="mt-2 opacity-70">
          Personaliza la apariencia de tu panel de control.
        </p>
      </div>

      <section
        className="rounded-2xl p-6 shadow-sm"
        style={{ backgroundColor: theme.surface }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Palette size={24} style={{ color: theme.primary }} />
          <div>
            <h2 className="text-xl font-bold">
              Paletas de colores
            </h2>
            <p className="text-sm opacity-60">
              Selecciona una de las cuatro combinaciones disponibles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(palettes).map(([key, palette]) => {
            const selected = selectedPalette === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedPalette(key)}
                className="text-left rounded-xl border-2 p-4 transition-all hover:shadow-md"
                style={{
                  borderColor: selected
                    ? theme.primary
                    : "#D1D5DB",
                  backgroundColor: selected
                    ? theme.background
                    : theme.surface,
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">
                    {palette.name}
                  </h3>

                  {selected && (
                    <Check
                      size={22}
                      style={{ color: theme.primary }}
                    />
                  )}
                </div>

                <div className="flex overflow-hidden rounded-lg h-12 mb-3">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {palette.colors.map((color, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="h-8 rounded-md border border-black/10"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[10px] opacity-60">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className="rounded-2xl p-6 shadow-sm"
        style={{ backgroundColor: theme.surface }}
      >
        <div className="flex items-center gap-3 mb-5">
          <Paintbrush size={22} style={{ color: theme.primary }} />
          <h2 className="text-xl font-bold">
            Vista previa
          </h2>
        </div>

        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: theme.background,
            color: theme.text,
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Lightbulb size={28} style={{ color: theme.primary }} />
            <div>
              <h3 className="font-bold text-lg">
                Panel de alumbrado
              </h3>
              <p className="text-sm opacity-70">
                Ejemplo de la paleta seleccionada
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: theme.primary,
                color: "#FFFFFF",
              }}
            >
              <p className="text-sm opacity-80">Principal</p>
              <p className="font-bold">{theme.primary}</p>
            </div>

            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: theme.secondary,
                color: "#FFFFFF",
              }}
            >
              <p className="text-sm opacity-80">Secundario</p>
              <p className="font-bold">{theme.secondary}</p>
            </div>

            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: theme.accent,
                color: "#263238",
              }}
            >
              <p className="text-sm">Acento</p>
              <p className="font-bold">{theme.accent}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Configuracion;

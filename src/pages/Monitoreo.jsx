
import { useState } from "react";

import {
  Activity,
  Lightbulb,
  Power,
  PowerOff,
  Zap,
  Sun,
  TrendingUp,
  Settings2,
  Check,
  AlertTriangle,
  ShieldCheck,
  BatteryWarning,
  Bell,
} from "lucide-react";

function Monitoreo({
  lamps = [],
  totalConsumption = 0,
  theme,
}) {
  const [energyMode, setEnergyMode] = useState("automatico");
  const [simulateFaults, setSimulateFaults] = useState(false);

  // ESTADÍSTICAS GENERALES
  const activeLamps = lamps.filter((lamp) => lamp.status).length;
  const inactiveLamps = lamps.length - activeLamps;

  const monthlyConsumption = totalConsumption * 30;

  const solarGeneration = lamps.reduce(
    (total, lamp) =>
      total +
      ((Number(lamp.panelWatts) || 0) * 5 * 0.75) / 1000,
    0
  );

  const solarBalance = solarGeneration - totalConsumption;

  // OPCIONES DE ENERGÍA
  const energyOptions = [
    {
      id: "automatico",
      title: "Automático",
      description: "El sistema selecciona la fuente de energía.",
      icon: Settings2,
    },
    {
      id: "solar",
      title: "Energía solar",
      description: "Utilizar energía generada por los paneles solares.",
      icon: Sun,
    },
    {
      id: "electrica",
      title: "Energía eléctrica",
      description: "Utilizar energía de la red eléctrica.",
      icon: Zap,
    },
  ];

  const selectedEnergy = energyOptions.find(
    (option) => option.id === energyMode
  );

  // DETECCIÓN DE FALLOS REALES
  const realFaults = lamps.flatMap((lamp) => {
    const faults = [];

    if (lamp.status && Number(lamp.current) <= 0) {
      faults.push({
        id: `current-${lamp.id}`,
        lamp: lamp.name,
        location: lamp.location,
        title: "Luminaria sin respuesta",
        description:
          "La luminaria está encendida, pero no registra corriente.",
        severity: "Alto",
        simulated: false,
      });
    }

    if (Number(lamp.voltage) <= 0) {
      faults.push({
        id: `voltage-${lamp.id}`,
        lamp: lamp.name,
        location: lamp.location,
        title: "Fallo de alimentación",
        description: "No se detecta voltaje en la luminaria.",
        severity: "Alto",
        simulated: false,
      });
    }

    if (Number(lamp.panelWatts) <= 0) {
      faults.push({
        id: `panel-${lamp.id}`,
        lamp: lamp.name,
        location: lamp.location,
        title: "Fallo del panel solar",
        description: "El panel solar no registra potencia.",
        severity: "Alto",
        simulated: false,
      });
    }

    return faults;
  });

  // FALLOS SIMULADOS
  const faultTemplates = [
    {
      title: "Luminaria sin respuesta",
      description:
        "La luminaria dejó de responder al sistema de control.",
      severity: "Alto",
    },
    {
      title: "Fallo de alimentación",
      description:
        "Se detectó una interrupción en la alimentación eléctrica.",
      severity: "Alto",
    },
    {
      title: "Fallo del panel solar",
      description:
        "El panel solar dejó de generar energía.",
      severity: "Alto",
    },
  ];

  const simulatedFaults = simulateFaults
    ? faultTemplates.slice(0, lamps.length).map((fault, index) => ({
        ...fault,
        id: `simulated-${index}`,
        lamp: lamps[index].name,
        location: lamps[index].location,
        simulated: true,
      }))
    : [];

  const detectedFaults = [...realFaults, ...simulatedFaults];

  const highFaults = detectedFaults.filter(
    (fault) => fault.severity === "Alto"
  ).length;

  return (
    <div
      className="min-h-screen p-4 md:p-6 space-y-6"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      {/* ENCABEZADO */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Monitoreo del sistema
        </h1>

        <p className="mt-1 opacity-70">
          Supervisión del funcionamiento y consumo energético de las luminarias.
        </p>
      </div>

      {/* ESTADO GENERAL */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Estado general
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de luminarias"
            value={lamps.length}
            icon={Lightbulb}
            theme={theme}
          />

          <StatCard
            title="Luminarias encendidas"
            value={activeLamps}
            icon={Power}
            theme={theme}
          />

          <StatCard
            title="Luminarias apagadas"
            value={inactiveLamps}
            icon={PowerOff}
            theme={theme}
          />

          <StatCard
            title="Consumo diario"
            value={`${Number(totalConsumption).toFixed(2)} kWh`}
            icon={Activity}
            theme={theme}
          />
        </div>
      </section>

      {/* SELECCIÓN DE ENERGÍA */}
      <section
        className="rounded-2xl p-5 shadow-sm"
        style={{ backgroundColor: theme.surface }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap size={24} style={{ color: theme.primary }} />

          <div>
            <h2 className="text-xl font-bold">
              Selección de energía
            </h2>

            <p className="text-sm opacity-65">
              Selecciona la fuente de energía del sistema.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {energyOptions.map((option) => {
            const Icon = option.icon;
            const selected = energyMode === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setEnergyMode(option.id)}
                className="rounded-xl p-4 text-left border-2 transition-all"
                style={{
                  borderColor: selected
                    ? theme.accent
                    : theme.background,
                  backgroundColor: selected
                    ? theme.background
                    : theme.surface,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon
                    size={25}
                    style={{ color: theme.primary }}
                  />

                  {selected && (
                    <Check
                      size={20}
                      style={{ color: theme.primary }}
                    />
                  )}
                </div>

                <h3 className="font-bold">
                  {option.title}
                </h3>

                <p className="text-sm opacity-65 mt-1">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {selectedEnergy && (
          <div
            className="mt-4 rounded-xl p-3 flex items-center gap-3"
            style={{ backgroundColor: theme.background }}
          >
            <ShieldCheck
              size={22}
              style={{ color: theme.primary }}
            />

            <p className="text-sm">
              Fuente seleccionada:{" "}
              <strong>{selectedEnergy.title}</strong>
            </p>
          </div>
        )}
      </section>

      {/* CONSUMO ENERGÉTICO */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Consumo energético
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Consumo diario"
            value={`${Number(totalConsumption).toFixed(2)} kWh`}
            icon={Zap}
            theme={theme}
          />

          <StatCard
            title="Consumo mensual estimado"
            value={`${monthlyConsumption.toFixed(2)} kWh`}
            icon={TrendingUp}
            theme={theme}
          />

          <StatCard
            title="Generación solar estimada"
            value={`${solarGeneration.toFixed(2)} kWh`}
            icon={Sun}
            theme={theme}
          />

          <StatCard
            title="Balance solar"
            value={`${solarBalance.toFixed(2)} kWh`}
            icon={Activity}
            theme={theme}
          />
        </div>
      </section>

      {/* NOTIFICACIONES DE FALLOS */}
      <section
        className="rounded-2xl p-5 shadow-sm"
        style={{ backgroundColor: theme.surface }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: theme.background }}
            >
              <Bell
                size={24}
                style={{ color: theme.primary }}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Notificaciones de fallos
              </h2>

              <p className="text-sm opacity-65">
                Alertas sobre problemas en luminarias y paneles solares.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSimulateFaults((previous) => !previous)
            }
            className="rounded-xl px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.primary }}
          >
            {simulateFaults
              ? "Desactivar simulación"
              : "Simular fallos importantes"}
          </button>
        </div>

        {/* RESUMEN DE FALLOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: theme.background }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle
                size={21}
                color={detectedFaults.length > 0 ? "#DC2626" : theme.primary}
              />

              <span className="text-sm opacity-70">
                Fallos detectados
              </span>
            </div>

            <p className="text-3xl font-bold">
              {detectedFaults.length}
            </p>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: theme.background }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BatteryWarning
                size={21}
                color={highFaults > 0 ? "#DC2626" : theme.primary}
              />

              <span className="text-sm opacity-70">
                Fallos de prioridad alta
              </span>
            </div>

            <p className="text-3xl font-bold">
              {highFaults}
            </p>
          </div>
        </div>

        {/* LISTA DE NOTIFICACIONES */}
        {detectedFaults.length > 0 ? (
          <div className="space-y-3">
            {detectedFaults.map((fault) => (
              <div
                key={fault.id}
                className="rounded-xl border-l-4 p-4"
                style={{
                  backgroundColor: theme.background,
                  borderLeftColor: "#DC2626",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <AlertTriangle
                        size={22}
                        color="#DC2626"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">
                          {fault.title}
                        </h3>

                        {fault.simulated && (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                            FALLA SIMULADA
                          </span>
                        )}
                      </div>

                      <p className="text-sm opacity-75 mt-1">
                        {fault.description}
                      </p>

                      <p className="text-sm mt-2">
                        <strong>Luminaria:</strong> {fault.lamp}
                      </p>

                      <p className="text-sm">
                        <strong>Ubicación:</strong> {fault.location}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700 w-fit">
                    PRIORIDAD ALTA
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl p-6 text-center"
            style={{ backgroundColor: theme.background }}
          >
            <ShieldCheck
              size={38}
              className="mx-auto mb-3"
              style={{ color: theme.primary }}
            />

            <h3 className="font-bold text-lg">
              No se detectan fallos
            </h3>

            <p className="text-sm opacity-65 mt-1">
              Todas las luminarias y paneles solares se encuentran
              sin fallos registrados.
            </p>
          </div>
        )}
      </section>

      {/* ESTADO INDIVIDUAL */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Estado individual de las luminarias
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lamps.map((lamp) => (
            <div
              key={lamp.id}
              className="rounded-2xl p-4 shadow-sm"
              style={{ backgroundColor: theme.surface }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb
                    size={22}
                    style={{ color: theme.primary }}
                  />

                  <h3 className="font-bold">
                    {lamp.name}
                  </h3>
                </div>

                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: lamp.status
                      ? "#DCFCE7"
                      : "#FEE2E2",
                    color: lamp.status
                      ? "#166534"
                      : "#991B1B",
                  }}
                >
                  {lamp.status ? "ENCENDIDA" : "APAGADA"}
                </span>
              </div>

              <p className="text-sm opacity-65 mb-3">
                {lamp.location}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-65">Voltaje</span>
                  <strong>{lamp.voltage} V</strong>
                </div>

                <div className="flex justify-between">
                  <span className="opacity-65">Corriente</span>
                  <strong>{lamp.current} A</strong>
                </div>

                <div className="flex justify-between">
                  <span className="opacity-65">Panel solar</span>
                  <strong>{lamp.panelWatts} W</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// COMPONENTE DE TARJETAS
function StatCard({ title, value, icon: Icon, theme }) {
  return (
    <div
      className="rounded-2xl p-5 shadow-sm"
      style={{ backgroundColor: theme.surface }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm opacity-65">{title}</p>

        <Icon
          size={23}
          style={{ color: theme.primary }}
        />
      </div>

      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

export default Monitoreo;


import { useState } from "react";

import {
  Lightbulb,
  Search,
  Power,
  PowerOff,
  AlertTriangle,
  Clock,
  CalendarDays,
  Thermometer,
  Zap,
  Sun,
  Activity,
  Wrench,
  MapPin,
  Battery,
} from "lucide-react";

import { calculateLampPrediction } from "../utils/predictions";

function Luminarias({ lamps, toggleLamp, theme }) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("Todos");

  // CALCULAR PREDICCIONES
  const lampsWithPrediction = lamps.map((lamp) => ({
    ...lamp,
    prediction: calculateLampPrediction(lamp),
  }));

  // CONVERTIR VIDA RESTANTE A AÑOS Y MESES
  const formatRemainingLife = (days) => {
    const totalMonths = Math.max(0, Math.round(Number(days || 0) / 30.4375));

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0 && months === 0) {
      return "Menos de 1 mes";
    }

    if (years === 0) {
      return `${months} ${months === 1 ? "mes" : "meses"}`;
    }

    if (months === 0) {
      return `${years} ${years === 1 ? "año" : "años"}`;
    }

    return `${years} ${years === 1 ? "año" : "años"} y ${months} ${
      months === 1 ? "mes" : "meses"
    }`;
  };

  // FILTRAR LUMINARIAS POR BÚSQUEDA Y RIESGO
  const filteredLamps = lampsWithPrediction.filter((lamp) => {
    const matchesSearch =
      lamp.name.toLowerCase().includes(search.toLowerCase()) ||
      lamp.location.toLowerCase().includes(search.toLowerCase());

    const matchesRisk =
      riskFilter === "Todos" ||
      lamp.prediction.risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  // COLORES PARA LOS NIVELES DE RIESGO
  const getRiskStyle = (risk) => {
    switch (risk) {
      case "Alto":
        return {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
        };

      case "Medio":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
        };

      default:
        return {
          backgroundColor: "#DCFCE7",
          color: "#166534",
        };
    }
  };

  // FORMATO DE FECHA
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // TARJETA DE INFORMACIÓN TÉCNICA
  const TechnicalData = ({ icon: Icon, label, value }) => (
    <div
      className="rounded-xl p-3"
      style={{ backgroundColor: theme.background }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon
          size={17}
          style={{ color: theme.secondary }}
        />

        <span className="text-xs opacity-70">
          {label}
        </span>
      </div>

      <p
        className="font-bold text-sm"
        style={{ color: theme.text }}
      >
        {value}
      </p>
    </div>
  );

  return (
    <div className="space-y-7">
      {/* ENCABEZADO */}
      <header>
        <h1
          className="text-3xl font-bold"
          style={{ color: theme.primary }}
        >
          Luminarias
        </h1>

        <p className="mt-2 opacity-70">
          Administra las luminarias y consulta sus predicciones de funcionamiento.
        </p>
      </header>

      {/* RESUMEN */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-2xl p-5 shadow-sm"
          style={{ backgroundColor: theme.surface }}
        >
          <p className="text-sm opacity-70">
            Total de luminarias
          </p>

          <h2
            className="text-3xl font-bold mt-2"
            style={{ color: theme.primary }}
          >
            {lamps.length}
          </h2>
        </div>

        <div
          className="rounded-2xl p-5 shadow-sm"
          style={{ backgroundColor: theme.surface }}
        >
          <p className="text-sm opacity-70">
            Riesgo alto
          </p>

          <h2 className="text-3xl font-bold mt-2 text-red-600">
            {
              lampsWithPrediction.filter(
                (lamp) => lamp.prediction.risk === "Alto"
              ).length
            }
          </h2>
        </div>

        <div
          className="rounded-2xl p-5 shadow-sm"
          style={{ backgroundColor: theme.surface }}
        >
          <p className="text-sm opacity-70">
            Riesgo medio
          </p>

          <h2 className="text-3xl font-bold mt-2 text-amber-600">
            {
              lampsWithPrediction.filter(
                (lamp) => lamp.prediction.risk === "Medio"
              ).length
            }
          </h2>
        </div>
      </section>

      {/* BUSCADOR Y FILTROS */}
      <section
        className="rounded-2xl p-5 shadow-sm"
        style={{ backgroundColor: theme.surface }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
            />

            <input
              type="text"
              placeholder="Buscar por luminaria o ubicación..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl py-3 pl-10 pr-4 outline-none border"
              style={{
                backgroundColor: theme.background,
                color: theme.text,
                borderColor: `${theme.text}30`,
              }}
            />
          </div>

          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
            className="rounded-xl px-4 py-3 outline-none border"
            style={{
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: `${theme.text}30`,
            }}
          >
            <option value="Todos">Todos los riesgos</option>
            <option value="Alto">Riesgo alto</option>
            <option value="Medio">Riesgo medio</option>
            <option value="Bajo">Riesgo bajo</option>
          </select>
        </div>
      </section>

      {/* LISTADO DE LUMINARIAS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            Listado de luminarias
          </h2>

          <span className="text-sm opacity-60">
            {filteredLamps.length} resultado(s)
          </span>
        </div>

        {filteredLamps.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center shadow-sm"
            style={{ backgroundColor: theme.surface }}
          >
            <Search
              size={35}
              className="mx-auto mb-3 opacity-40"
            />

            <h3 className="font-bold text-lg">
              No se encontraron luminarias
            </h3>

            <p className="text-sm opacity-60 mt-2">
              Intenta cambiar la búsqueda o el filtro seleccionado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredLamps.map((lamp) => {
              const prediction = lamp.prediction;
              const riskStyle = getRiskStyle(prediction.risk);

              return (
                <article
                  key={lamp.id}
                  className="rounded-2xl p-5 shadow-sm space-y-5"
                  style={{ backgroundColor: theme.surface }}
                >
                  {/* ENCABEZADO DE LA TARJETA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-3 rounded-xl"
                        style={{
                          backgroundColor: theme.primary,
                          color: "#FFFFFF",
                        }}
                      >
                        <Lightbulb size={25} />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg">
                          {lamp.name}
                        </h3>

                        <p className="flex items-center gap-1 text-sm opacity-60">
                          <MapPin size={14} />
                          {lamp.location}
                        </p>
                      </div>
                    </div>

                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold w-fit"
                      style={riskStyle}
                    >
                      Riesgo {prediction.risk}
                    </span>
                  </div>

                  {/* ESTADO Y CONTROL */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl p-4"
                    style={{ backgroundColor: theme.background }}
                  >
                    <div className="flex items-center gap-3">
                      {lamp.status ? (
                        <Power
                          size={22}
                          className="text-green-600"
                        />
                      ) : (
                        <PowerOff
                          size={22}
                          className="text-gray-500"
                        />
                      )}

                      <div>
                        <p className="font-semibold text-sm">
                          Estado de la luminaria
                        </p>

                        <p className="text-xs opacity-60">
                          {lamp.status ? "Encendida" : "Apagada"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleLamp(lamp.id)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition hover:opacity-80"
                      style={{
                        backgroundColor: lamp.status
                          ? "#FEE2E2"
                          : theme.secondary,
                        color: lamp.status
                          ? "#991B1B"
                          : "#FFFFFF",
                      }}
                    >
                      {lamp.status ? "Apagar" : "Encender"}
                    </button>
                  </div>

                  {/* VIDA ÚTIL */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock
                          size={18}
                          style={{ color: theme.secondary }}
                        />

                        <h4 className="font-bold">
                          Vida útil restante
                        </h4>
                      </div>

                      <span className="text-sm font-bold">
                        {prediction.lifePercentage.toFixed(1)}%
                      </span>
                    </div>

                    <div
                      className="w-full h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: theme.background }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, prediction.lifePercentage)
                          )}%`,
                          backgroundColor:
                            prediction.risk === "Alto"
                              ? "#E76F51"
                              : prediction.risk === "Medio"
                              ? "#E9B949"
                              : "#22A06B",
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div>
                        <p className="text-xs opacity-60">
                          Horas
                        </p>

                        <p className="font-bold">
                          {Math.round(
                            prediction.remainingHours
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs opacity-60">
                          Días
                        </p>

                        <p className="font-bold">
                          {Math.round(prediction.remainingDays)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs opacity-60">
                          Vida restante
                        </p>

                        <p className="font-bold text-sm">
                          {formatRemainingLife(prediction.remainingDays)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FECHA ESTIMADA */}
                  <div
                    className="rounded-xl p-4 flex items-center gap-3"
                    style={{ backgroundColor: theme.background }}
                  >
                    <CalendarDays
                      size={22}
                      style={{ color: theme.secondary }}
                    />

                    <div>
                      <p className="text-xs opacity-60">
                        Fecha estimada de reemplazo
                      </p>

                      <p className="font-bold text-sm">
                        {formatDate(prediction.replacementDate)}
                      </p>
                    </div>
                  </div>

                  {/* INFORMACIÓN TÉCNICA */}
                  <div>
                    <h4 className="font-bold mb-3">
                      Información técnica
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <TechnicalData
                        icon={Zap}
                        label="Potencia"
                        value={`${lamp.watts} W`}
                      />

                      <TechnicalData
                        icon={Activity}
                        label="Voltaje"
                        value={`${lamp.voltage} V`}
                      />

                      <TechnicalData
                        icon={Battery}
                        label="Corriente"
                        value={`${lamp.current} A`}
                      />

                      <TechnicalData
                        icon={Clock}
                        label="Uso diario"
                        value={`${lamp.hoursDay} h`}
                      />

                      <TechnicalData
                        icon={Thermometer}
                        label="Temperatura"
                        value={`${lamp.temperature} °C`}
                      />

                      <TechnicalData
                        icon={Sun}
                        label="Panel solar"
                        value={`${lamp.panelWatts} W`}
                      />
                    </div>
                  </div>

                  {/* CONSUMO Y GENERACIÓN SOLAR */}
                  <div>
                    <h4 className="font-bold mb-3">
                      Información energética
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="rounded-xl p-4"
                        style={{ backgroundColor: theme.background }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Zap
                            size={17}
                            style={{ color: theme.secondary }}
                          />

                          <span className="text-xs opacity-70">
                            Consumo diario
                          </span>
                        </div>

                        <p className="font-bold">
                          {prediction.dailyConsumption.toFixed(2)} kWh
                        </p>
                      </div>

                      <div
                        className="rounded-xl p-4"
                        style={{ backgroundColor: theme.background }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sun
                            size={17}
                            style={{ color: theme.secondary }}
                          />

                          <span className="text-xs opacity-70">
                            Generación solar
                          </span>
                        </div>

                        <p className="font-bold">
                          {prediction.solarGeneration.toFixed(2)} kWh
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MANTENIMIENTO */}
                  <div
                    className="rounded-xl p-4 flex items-start gap-3"
                    style={{
                      backgroundColor:
                        prediction.risk === "Alto"
                          ? "#FEE2E2"
                          : theme.background,
                      color:
                        prediction.risk === "Alto"
                          ? "#991B1B"
                          : theme.text,
                    }}
                  >
                    {prediction.risk === "Alto" ? (
                      <AlertTriangle size={22} />
                    ) : (
                      <Wrench size={22} />
                    )}

                    <div>
                      <p className="font-bold text-sm">
                        Mantenimiento preventivo
                      </p>

                      <p className="text-xs mt-1 opacity-80">
                        Se recomienda revisar esta luminaria
                        cada {prediction.maintenanceDays} días.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Luminarias;

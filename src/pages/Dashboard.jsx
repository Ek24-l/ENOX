
import {
  Lightbulb,
  Power,
  PowerOff,
  Zap,
  AlertTriangle,
  Sun,
  Activity,
  Clock,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { calculateLampPrediction } from "../utils/predictions";

const Dashboard = ({ lamps, totalConsumption, theme }) => {
  const predictions = lamps.map((lamp) => ({
    ...lamp,
    prediction: calculateLampPrediction(lamp),
  }));

  const totalLamps = lamps.length;

  const activeLamps = lamps.filter((lamp) => lamp.status).length;
  const inactiveLamps = totalLamps - activeLamps;

  const dailyConsumption = predictions.reduce(
    (total, lamp) => total + lamp.prediction.dailyConsumption,
    0
  );

  const monthlyConsumption = dailyConsumption * 30;

  const solarGeneration = lamps.reduce((total, lamp) => {
    const panelWatts = Number(lamp.panelWatts) || 0;

    return total + (panelWatts * 5 * 0.75) / 1000;
  }, 0);

  const solarUsed = Math.min(dailyConsumption, solarGeneration);

  const electricUsed = Math.max(
    0,
    dailyConsumption - solarUsed
  );

  // Colores de energía según la paleta seleccionada.
  const isBosque = theme.name === "Bosque";
  const isAzulNaranja = theme.name === "Azul y naranja";

  const solarColor = isBosque
    ? "#A3B18A"
    : isAzulNaranja
    ? "#8ECAE6"
    : theme.accent;

  const electricColor = isBosque
    ? "#588157"
    : isAzulNaranja
    ? "#219EBC"
    : theme.electric;

  const highRiskLamps = predictions.filter(
    (lamp) => lamp.prediction.risk === "Alto"
  );

  const mediumRiskLamps = predictions.filter(
    (lamp) => lamp.prediction.risk === "Medio"
  );

  const lowRiskLamps = predictions.filter(
    (lamp) => lamp.prediction.risk === "Bajo"
  );

  const riskData = [
    {
      name: "Riesgo bajo",
      value: lowRiskLamps.length,
      color: "#588157",
    },
    {
      name: "Riesgo medio",
      value: mediumRiskLamps.length,
      color: "#E9C46A",
    },
    {
      name: "Riesgo alto",
      value: highRiskLamps.length,
      color: "#E76F51",
    },
  ];

  const lifeData = predictions.map((lamp) => ({
    name: lamp.name,
    vida: Math.round(lamp.prediction.lifePercentage),
  }));

  // Datos semanales estimados.
  const weeklyData = [
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
    "Dom",
  ].map((day) => ({
    day,
    solar: Number(solarUsed.toFixed(2)),
    electric: Number(electricUsed.toFixed(2)),
  }));

  // Datos mensuales estimados.
  const monthlyData = [
    { week: "Semana 1", days: 7 },
    { week: "Semana 2", days: 7 },
    { week: "Semana 3", days: 7 },
    { week: "Semana 4", days: 7 },
    { week: "Semana 5", days: 2 },
  ].map((item) => ({
    week: item.week,
    solar: Number((solarUsed * item.days).toFixed(2)),
    electric: Number((electricUsed * item.days).toFixed(2)),
  }));

  const cardStyle = {
    backgroundColor: theme.surface,
    border: `1px solid ${theme.soft}`,
  };

  const tooltipStyle = {
    backgroundColor: theme.surface,
    border: `1px solid ${theme.soft}`,
    borderRadius: "10px",
    color: theme.text,
  };

  return (
    <div className="space-y-8">

      {/* ENCABEZADO */}
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: theme.primary }}
        >
          Dashboard
        </h1>

        <p
          className="mt-2"
          style={{ color: theme.text }}
        >
          Resumen general del sistema de alumbrado público.
        </p>
      </div>

      {/* INDICADORES PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div
          className="rounded-2xl p-5 shadow-sm"
          style={cardStyle}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">
                Total de luminarias
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalLamps}
              </h2>
            </div>

            <Lightbulb
              size={32}
              color={theme.accent}
            />
          </div>
        </div>

        <div
          className="rounded-2xl p-5 shadow-sm"
          style={cardStyle}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">
                Luminarias encendidas
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {activeLamps}
              </h2>
            </div>

            <Power
              size={32}
              color="#588157"
            />
          </div>
        </div>

        <div
          className="rounded-2xl p-5 shadow-sm"
          style={cardStyle}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">
                Luminarias apagadas
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {inactiveLamps}
              </h2>
            </div>

            <PowerOff
              size={32}
              color="#E76F51"
            />
          </div>
        </div>

        <div
          className="rounded-2xl p-5 shadow-sm"
          style={cardStyle}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">
                Consumo diario
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {dailyConsumption.toFixed(2)}
                <span className="text-sm ml-1">kWh</span>
              </h2>
            </div>

            <Zap
              size={32}
              color={theme.accent}
            />
          </div>
        </div>

      </div>

      {/* ALERTAS */}
      {highRiskLamps.length > 0 && (
        <div
          className="rounded-2xl p-5 flex items-start gap-4"
          style={{
            backgroundColor: "#FCE8E5",
            border: "1px solid #E76F51",
            color: "#8B2E20",
          }}
        >
          <AlertTriangle size={26} />

          <div>
            <h3 className="font-bold">
              Atención: luminarias con riesgo alto
            </h3>

            <p className="text-sm mt-1">
              Se detectaron {highRiskLamps.length} luminarias
              que requieren revisión o mantenimiento.
            </p>
          </div>
        </div>
      )}

      {/* GRÁFICAS DE ESTADO Y VIDA ÚTIL */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* RIESGO */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={cardStyle}
        >
          <h2
            className="text-xl font-bold mb-5"
            style={{ color: theme.primary }}
          >
            Estado de las luminarias
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {riskData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* VIDA ÚTIL */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={cardStyle}
        >
          <h2
            className="text-xl font-bold mb-5"
            style={{ color: theme.primary }}
          >
            Vida útil de las luminarias
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lifeData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 35,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.soft}
                />

                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  tick={{ fill: theme.text, fontSize: 11 }}
                />

                <YAxis
                  tick={{ fill: theme.text }}
                  unit="%"
                />

                <Tooltip contentStyle={tooltipStyle} />

                <Bar
                  dataKey="vida"
                  name="Vida útil"
                  radius={[5, 5, 0, 0]}
                >
                  {lifeData.map((entry, index) => (
                    <Cell
                      key={`vida-${index}`}
                      fill={
                        entry.vida < 25
                          ? "#E53935"
                          : entry.vida <= 50
                          ? "#FBC02D"
                          : "#3A5A40"
                      }
                    />
                  ))}
                </Bar>

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CONSUMO ENERGÉTICO */}
      <div
        className="rounded-2xl p-6 shadow-sm space-y-6"
        style={cardStyle}
      >

        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: theme.primary }}
          >
            Consumo energético
          </h2>

          <p className="text-sm opacity-70 mt-1">
            Distribución estimada entre energía solar y energía eléctrica.
          </p>
        </div>

        {/* RESUMEN DE CONSUMO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: theme.background }}
          >
            <div className="flex items-center gap-2">
              <Sun size={20} color={solarColor} />

              <p className="text-sm">
                Energía solar
              </p>
            </div>

            <h3
              className="text-2xl font-bold mt-2"
              style={{ color: solarColor }}
            >
              {solarUsed.toFixed(2)} kWh
            </h3>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: theme.background }}
          >
            <div className="flex items-center gap-2">
              <Zap size={20} color={electricColor} />

              <p className="text-sm">
                Energía eléctrica
              </p>
            </div>

            <h3
              className="text-2xl font-bold mt-2"
              style={{ color: electricColor }}
            >
              {electricUsed.toFixed(2)} kWh
            </h3>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: theme.background }}
          >
            <div className="flex items-center gap-2">
              <Activity size={20} color={theme.primary} />

              <p className="text-sm">
                Consumo total diario
              </p>
            </div>

            <h3
              className="text-2xl font-bold mt-2"
              style={{ color: theme.primary }}
            >
              {dailyConsumption.toFixed(2)} kWh
            </h3>
          </div>

        </div>

        {/* LEYENDA DE COLORES */}
        <div className="flex flex-wrap gap-6">

          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: solarColor }}
            />

            <span className="text-sm">
              Energía solar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: electricColor }}
            />

            <span className="text-sm">
              Energía eléctrica
            </span>
          </div>

        </div>

        {/* CONSUMO SEMANAL */}
        <div>
          <h3
            className="font-bold text-lg mb-4"
            style={{ color: theme.primary }}
          >
            Consumo semanal
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{
                  top: 10,
                  right: 15,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.soft}
                />

                <XAxis
                  dataKey="day"
                  tick={{ fill: theme.text }}
                />

                <YAxis
                  tick={{ fill: theme.text }}
                  unit=" kWh"
                />

                <Tooltip contentStyle={tooltipStyle} />

                <Legend />

                <Bar
                  dataKey="solar"
                  name="Energía solar"
                  stackId="a"
                  fill={solarColor}
                />

                <Bar
                  dataKey="electric"
                  name="Energía eléctrica"
                  stackId="a"
                  fill={electricColor}
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CONSUMO MENSUAL */}
        <div>
          <h3
            className="font-bold text-lg mb-4"
            style={{ color: theme.primary }}
          >
            Consumo mensual
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 15,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.soft}
                />

                <XAxis
                  dataKey="week"
                  tick={{ fill: theme.text }}
                />

                <YAxis
                  tick={{ fill: theme.text }}
                  unit=" kWh"
                />

                <Tooltip contentStyle={tooltipStyle} />

                <Legend />

                <Bar
                  dataKey="solar"
                  name="Energía solar"
                  stackId="a"
                  fill={solarColor}
                />

                <Bar
                  dataKey="electric"
                  name="Energía eléctrica"
                  stackId="a"
                  fill={electricColor}
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-xs opacity-60">
          Nota: Los valores semanales y mensuales son estimaciones
          calculadas a partir del consumo diario y la generación solar
          estimada. No representan mediciones históricas reales.
        </p>

      </div>

      {/* TABLA DE LUMINARIAS */}
      <div
        className="rounded-2xl p-6 shadow-sm"
        style={cardStyle}
      >
        <h2
          className="text-xl font-bold mb-5"
          style={{ color: theme.primary }}
        >
          Estado de las luminarias
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">

            <thead>
              <tr
                style={{
                  backgroundColor: theme.background,
                  color: theme.text,
                }}
              >
                <th className="p-3">Luminaria</th>
                <th className="p-3">Ubicación</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Riesgo</th>
                <th className="p-3">Horas restantes</th>
              </tr>
            </thead>

            <tbody>
              {predictions.map((lamp) => (
                <tr
                  key={lamp.id}
                  className="border-b"
                  style={{ borderColor: theme.soft }}
                >
                  <td className="p-3 font-medium">
                    {lamp.name}
                  </td>

                  <td className="p-3">
                    {lamp.location}
                  </td>

                  <td className="p-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: lamp.status
                          ? "#DCEFE0"
                          : "#FCE8E5",
                        color: lamp.status
                          ? "#357044"
                          : "#B13B2D",
                      }}
                    >
                      {lamp.status ? "Encendida" : "Apagada"}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor:
                          lamp.prediction.risk === "Alto"
                            ? "#FCE8E5"
                            : lamp.prediction.risk === "Medio"
                            ? "#FFF3CD"
                            : "#DCEFE0",

                        color:
                          lamp.prediction.risk === "Alto"
                            ? "#B13B2D"
                            : lamp.prediction.risk === "Medio"
                            ? "#946C00"
                            : "#357044",
                      }}
                    >
                      {lamp.prediction.risk}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock size={15} />

                      {Math.round(
                        lamp.prediction.remainingHours
                      ).toLocaleString()}{" "}
                      h
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

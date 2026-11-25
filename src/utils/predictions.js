
const MAX_REMAINING_HOURS = 5 * 365 * 12;
const SUN_HOURS = 5;
const SOLAR_EFFICIENCY = 0.75;

export const calculateLampPrediction = (lamp) => {
  const hoursPerDay = Number(lamp.hoursDay) || 12;
  const watts = Number(lamp.watts) || 0;
  const panelWatts = Number(lamp.panelWatts) || 0;
  const temperature = Number(lamp.temperature) || 0;

  // Máximo de cinco años de vida restante.
  const remainingHours = Math.max(
    0,
    Math.min(
      Number(lamp.remainingHours ?? MAX_REMAINING_HOURS),
      MAX_REMAINING_HOURS
    )
  );

  const remainingDays = remainingHours / hoursPerDay;
  const remainingYears = remainingDays / 365;

  const lifePercentage =
    (remainingHours / MAX_REMAINING_HOURS) * 100;

  const replacementDate = new Date();
  replacementDate.setDate(
    replacementDate.getDate() + Math.ceil(remainingDays)
  );

  // Clasificación de riesgo.
  let risk = "Bajo";

  if (remainingHours <= 360 || temperature >= 40) {
    risk = "Alto";
  } else if (remainingHours <= 8760 || temperature >= 35) {
    risk = "Medio";
  }

  const maintenanceDays =
    risk === "Alto" ? 7 :
    risk === "Medio" ? 30 : 90;

  const dailyConsumption = (watts * hoursPerDay) / 1000;
  const monthlyConsumption = dailyConsumption * 30;

  const solarGeneration =
    (panelWatts * SUN_HOURS * SOLAR_EFFICIENCY) / 1000;

  const solarBalance = solarGeneration - dailyConsumption;

  return {
    remainingHours,
    remainingDays,
    remainingYears,
    lifePercentage,
    replacementDate,
    risk,
    maintenanceDays,
    dailyConsumption,
    monthlyConsumption,
    solarGeneration,
    solarBalance,
  };
};

export const calculateAllPredictions = (lamps) =>
  lamps.map((lamp) => ({
    ...lamp,
    prediction: calculateLampPrediction(lamp),
  }));

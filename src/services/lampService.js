
export const updateLampStatus = (lamps, id) => {
  return lamps.map((lamp) =>
    lamp.id === id
      ? { ...lamp, status: !lamp.status }
      : lamp
  );
};

export const getLampById = (lamps, id) => {
  return lamps.find((lamp) => lamp.id === id);
};

export const getLampStatistics = (lamps) => {
  return {
    total: lamps.length,
    active: lamps.filter((lamp) => lamp.status).length,
    inactive: lamps.filter((lamp) => !lamp.status).length,
  };
};

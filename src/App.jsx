
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Luminarias from "./pages/Luminarias";
import Monitoreo from "./pages/Monitoreo";
import Configuracion from "./pages/Configuracion";
import { initialLamps } from "./data/lamps";

const palettes = {
  bosque: {
    name: "Bosque",
    colors: ["#DAD7CD", "#A3B18A", "#588157", "#3A5A40", "#344E41"],
    primary: "#344E41",
    secondary: "#3A5A40",
    accent: "#588157",
    soft: "#A3B18A",
    background: "#DAD7CD",
    surface: "#FFFFFF",
    text: "#344E41",
    electric: "#344E41",
  },

  beige: {
    name: "Beige",
    colors: ["#EDEDE9", "#D6CCC2", "#F5EBE0", "#E3D5CA", "#D5BDAF"],
    primary: "#D5BDAF",
    secondary: "#D6CCC2",
    accent: "#E3D5CA",
    soft: "#F5EBE0",
    background: "#EDEDE9",
    surface: "#FFFFFF",
    text: "#51463F",
    electric: "#A98467",
  },

  mediterranea: {
    name: "Mediterránea",
    colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
    primary: "#264653",
    secondary: "#2A9D8F",
    accent: "#E9C46A",
    soft: "#F4A261",
    background: "#F7F5EF",
    surface: "#FFFFFF",
    text: "#264653",
    electric: "#264653",
  },

  azulNaranja: {
    name: "Azul y naranja",
    colors: ["#8ECAE6", "#219EBC", "#023047", "#FFB703", "#FB8500"],
    primary: "#023047",
    secondary: "#219EBC",
    accent: "#FFB703",
    soft: "#8ECAE6",
    background: "#F1F7FA",
    surface: "#FFFFFF",
    text: "#023047",
    electric: "#023047",
  },
};

function App() {
  const [section, setSection] = useState("Inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState("bosque");
  const [lamps, setLamps] = useState(initialLamps);

  const theme = palettes[selectedPalette];

  // SIMULACIÓN AUTOMÁTICA DE ENCENDIDO Y APAGADO
  useEffect(() => {
    // Al iniciar, encender las luminarias impares.
    setLamps((previousLamps) =>
      previousLamps.map((lamp) => ({
        ...lamp,
        status: lamp.id % 2 !== 0,
      }))
    );

    let firstGroupActive = true;

    // Alternar los grupos cada 60 segundos.
    const simulationInterval = setInterval(() => {
      firstGroupActive = !firstGroupActive;

      setLamps((previousLamps) =>
        previousLamps.map((lamp) => ({
          ...lamp,
          status: firstGroupActive
            ? lamp.id % 2 !== 0
            : lamp.id % 2 === 0,
        }))
      );
    }, 60000);

    // Limpiar el intervalo cuando se desmonte la aplicación.
    return () => clearInterval(simulationInterval);
  }, []);

  // ENCENDER Y APAGAR LUMINARIAS MANUALMENTE
  const toggleLamp = (id) => {
    setLamps((previousLamps) =>
      previousLamps.map((lamp) =>
        lamp.id === id
          ? { ...lamp, status: !lamp.status }
          : lamp
      )
    );
  };

  // CONSUMO TOTAL
  const totalConsumption = lamps.reduce(
    (total, lamp) =>
      total +
      (Number(lamp.watts) * Number(lamp.hoursDay)) / 1000,
    0
  );

  // VARIABLES DE COLORES
  const themeStyles = {
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--accent": theme.accent,
    "--soft": theme.soft,
    "--background": theme.background,
    "--surface": theme.surface,
    "--text": theme.text,
    backgroundColor: theme.background,
    color: theme.text,
    minHeight: "100vh",
  };

  return (
    <div
      style={themeStyles}
      className="min-h-screen"
    >
      {/* BARRA LATERAL FIJA */}
      <Sidebar
        section={section}
        setSection={setSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        theme={theme}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main
        className="min-h-screen min-w-0 p-4 md:p-6 transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? "256px" : "80px",
        }}
      >
        {/* INICIO */}
        {section === "Inicio" && (
          <Dashboard
            lamps={lamps}
            totalConsumption={totalConsumption}
            theme={theme}
          />
        )}

        {/* LUMINARIAS */}
        {section === "Luminarias" && (
          <Luminarias
            lamps={lamps}
            toggleLamp={toggleLamp}
            theme={theme}
          />
        )}

        {/* MONITOREO */}
        {section === "Monitoreo" && (
          <Monitoreo
            lamps={lamps}
            totalConsumption={totalConsumption}
            theme={theme}
          />
        )}

        {/* CONFIGURACIÓN */}
        {section === "Configuración" && (
          <Configuracion
            selectedPalette={selectedPalette}
            setSelectedPalette={setSelectedPalette}
            palettes={palettes}
            theme={theme}
          />
        )}
      </main>
    </div>
  );
}

export default App;

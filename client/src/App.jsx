import { useState } from "react";
import "./App.css";
import axios from "axios";
import Map from "./components/Map";
import UserInput from "./components/UserInput";
import BarChart from "./components/BarChart";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Paper } from "@mui/material";
import logo from './logo.png';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Poppins',
      textTransform: 'none',
      fontSize: 16,
    },
  },
});

function App() {
  const URL = "https://natural-disasters-api.onrender.com/";
  const [year, setYear] = useState(new Date().getFullYear());
  const [view, setView] = useState("Severe Storm");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const fetchData = async (inputYear) => {
    try {
      setisLoading(true);
      const response = await axios.get(
        `${URL}predict_disasters?year=${inputYear}`
      );
      setisLoading(false);
      setYear(inputYear);
      setData(response.data);
      setError(null); // Reset error state if data is fetched successfully
    } catch (error) {
      setError(true); // Set error message
      setisLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>

    <div id="app">
      <div className="logo-container">
        <img src={logo} id="logo" alt="U.S. Natural Disaster Predictions" />
      </div>

      {/* User Input */}
      <UserInput
        view={view}
        setView={setView}
        setYear={setYear}
        fetchData={fetchData}
        isLoading={isLoading}
      />

      {/* Error Display */}
      {error && (
        <div className="error-view">
          <Alert severity="error" className="error_message">
            <AlertTitle>Error</AlertTitle>
            <p>Server has reached it's usage limits.</p>
          </Alert>
        </div>
      )}

      {/* Map and Bar Chart Display */}
      {data ? (
        <>
          <Paper id="section-map" className="map">
            <Map data={data} view={view} year={year} />
          </Paper>
          <Paper id="section-bar">
            <BarChart data={data} view={view} year={year} />
          </Paper>
        </>
      ) : (
        <div className={`user-info ${error && "hidden"}`}>
          <h2>Welcome!</h2>
          <p>This app is intended to predict potential natural disasters, specifically focused on the most common disasters in the U.S.</p>
          <div className="disaster-list">
            <p>• Severe Storms<br />
            • Hurricanes<br />
            • Floods<br />
            • Fires<br />
            • Tornadoes</p>
          </div>
          <Alert severity="info">
            Enter a year and select a disaster above to view predictions.
          </Alert>
          <h3>Notes:</h3>
          <p>Predictions are based on U.S. Natural Disaster Declarations dataset from{" "}
          <a href="https://www.kaggle.com/datasets/headsortails/us-natural-disaster-declarations">
            Kaggle
          </a>. This app was built for educational purposes only and does not guarantee accurate predictions.</p>
        </div>
      )}

      {isLoading && (
        <div className="loader">
          <CircularProgress />
          <span className="loading-text">
            Loading predictions...
          </span>
        </div>
      )}
    </div>

    </ThemeProvider>
  );
}

export default App;
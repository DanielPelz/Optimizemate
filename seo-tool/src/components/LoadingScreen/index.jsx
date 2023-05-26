import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import socket from "../../contexts/Socket/Socket";
import "./LoadingScreen.css";

const Container = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
}));

const LoadingScreen = ({ loadingMessage }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [estimatedTotalTime, setEstimatedTotalTime] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    

    socket.on("time_update", ({ remainingTime, estimatedTotalTime }) => {
      setRemainingTime(remainingTime);
      setEstimatedTotalTime(estimatedTotalTime);
    });
    socket.on("current_url", (currentUrl) => {
      setCurrentUrl(currentUrl);
      
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container>
      <CircularProgress
        size={60}
        thickness={4}
        sx={{ marginBottom: 2 }}
        value={100}
      />
      <Typography variant="h5" className="loading-message">
        {loadingMessage}
      </Typography>
      {currentUrl && (
        <Typography variant="subtitle1" className="absolute bottom-12" sx={{ marginBottom: 1 }}>
          Crawling: {currentUrl}
        </Typography>
      )}
      {remainingTime && estimatedTotalTime && (
        <Typography variant="subtitle1" className="absolute bottom-9">
          Verbleibende Zeit: {remainingTime} Minuten | Geschätzte Gesamtzeit:{" "}
          {estimatedTotalTime} Minuten
        </Typography>
      )}
    </Container>
  );
};

export default LoadingScreen;

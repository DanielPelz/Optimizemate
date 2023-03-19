import React, { useState, useEffect } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

const LoadingScreen = ({ loadingMessage }) => {
  const [loadingProgress] = useState(0);

  

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(242, 242, 242, 0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{ marginBottom: 2 }}
        value={loadingProgress}
      />
      <Typography variant="h5">{loadingMessage}</Typography>
    </Box>
  );
};

export default LoadingScreen;

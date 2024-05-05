/*client/src/scenes/loginPage/index.jsx*/
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form"; 
import React, { useRef } from "react";
import "./index.css"; 

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const textRef = useRef(null);

  const handlePullDown = (e) => {
    const deltaY = e.nativeEvent.deltaY;
    const currentFontSize = parseFloat(window.getComputedStyle(textRef.current).fontSize);
    const newFontSize = currentFontSize + deltaY * 0.1; // Adjust the factor for the desired increase rate
    textRef.current.style.fontSize = `${newFontSize}px`;
  };

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <img src="../assets/mango-logo.png" alt="Mango Mate Logo" style={{ maxWidth: "150px" }} />
        <Typography 
          ref={textRef}
          fontWeight="bold" 
          fontSize="32px" 
          color="primary"
          onWheel={handlePullDown}
          className="pullable-section"
        >
          MangoMate!
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Send a Mango, Make 'Em Glow!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
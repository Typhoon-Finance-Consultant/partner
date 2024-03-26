import React from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Logo from "../../../assets/images/brand.png";

function PreloginHeader() {
  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <IconButton>
          <img src={Logo} height={80} width={120} />
        </IconButton>{" "}
      </Container>
    </AppBar>
  );
}

export default PreloginHeader;

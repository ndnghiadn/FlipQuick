import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  max-height: 500px;
  padding: 10px 20px;
  overflow-y: auto;
`;
const StyledButton = styled.button`
  font-size: 14px;
  font-weight: 700;
  padding: 10px 20px;
  margin: 10px 0;
`;

const Finish = ({ handleRefresh, roomData, totalTime, handleRestart }) => {
  useEffect(() => {
    if (!roomData) return;
    handleRefresh();
  }, []);

  return (
    <Container>
      <span>You finished in {totalTime} seconds</span>{" "}
      <StyledButton onClick={handleRestart} style={{ marginLeft: "10px" }}>
        Back
      </StyledButton>
      {roomData && (
        <>
          <p>Records in this room:</p>
          <ul>
            {roomData.logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
          <StyledButton onClick={handleRefresh}>Refresh</StyledButton>
        </>
      )}
    </Container>
  );
};

export default Finish;

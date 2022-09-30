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

const Finish = ({ totalTime, roomId = null }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!roomId) return;
    handleRefresh();
  }, [roomId]);

  async function handleRefresh() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/rooms/${roomId}`
      );
      setLogs(response.data.data.logs);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <span>You finished in {totalTime}</span>
      {roomId && (
        <>
          <p>Records in this room:</p>
          <ul>
            {logs.map((log, index) => (
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

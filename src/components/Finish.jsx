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

const Finish = ({
  roomData,
  setRoomData,
  totalTime,
  handleRestart,
  setIsLoading,
  userData,
  timeRecord,
  strangerCode,
}) => {
  useEffect(() => {
    if (!roomData) return;
    if (userData) {
      setRoomData({
        ...roomData,
        logs: [...roomData.logs, `${userData.username}: ${timeRecord}s`],
      });
    } else {
      setRoomData({
        ...roomData,
        logs: [...roomData.logs, `stranger#${strangerCode}: ${timeRecord}s`],
      });
    }
  }, []);

  async function handleRefresh() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/rooms/getLogs/${roomData._id}`
      );
      setRoomData({ ...roomData, logs: response.data.data });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }

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

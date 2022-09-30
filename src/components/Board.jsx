import React, { useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const StyledButton = styled.button`
  font-size: 14px;
  font-weight: 700;
  padding: 10px 20px;
  margin: 10px 0;
  margin-left: 20px;
`;

const Board = ({
  cardsList,
  handleSelectCard,
  onStart,
  handleJoinRoom,
  hasJoinedRoom,
}) => {
  const [isStarted, setIsStarted] = useState(false);

  function handleClickStart() {
    setIsStarted(true);
    onStart();
  }

  return (
    <>
      {isStarted ? (
        <div className="Board--container">
          {cardsList.map((card, index) => (
            <>
              <Card
                key={index}
                card={card}
                handleSelectCard={handleSelectCard}
              />
            </>
          ))}
        </div>
      ) : (
        <>
          <StyledButton onClick={handleClickStart}>Start</StyledButton>
          {!hasJoinedRoom && (
            <StyledButton onClick={handleJoinRoom}>Join</StyledButton>
          )}
          <StyledButton>Login</StyledButton>
        </>
      )}
    </>
  );
};

export default Board;

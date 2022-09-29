import React, { useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const StyledButton = styled.button`
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 10px 20px;
  display: block;
  margin: 20px auto;
`;

const Board = ({ cardsList, handleSelectCard, onStart }) => {
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
        <StyledButton onClick={handleClickStart}>Start</StyledButton>
      )}
    </>
  );
};

export default Board;

import React, { useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  width: 500px;
  height: 500px;
  margin: 50px auto;
  display: grid;
  padding: 20px 15px;
  gap: 15px;
  grid-template-columns: auto auto auto auto;
  background-color: #679289;
  position: relative;
`;
const StyledButton = styled.button`
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 10px 20px;
  display: block;
  margin: 20px auto;
`;

const Board = ({ cardsList, handleSelectCard, onStart, isCheckDone }) => {
  const [isStarted, setIsStarted] = useState(false);

  function handleClickStart() {
    setIsStarted(true);
    onStart();
  }

  return (
    <>
      {isStarted ? (
        <Container>
          {cardsList.map((card, index) => (
            <>
              <Card
                key={index}
                card={card}
                handleSelectCard={handleSelectCard}
                isCheckDone={isCheckDone}
              />
            </>
          ))}
        </Container>
      ) : (
        <StyledButton onClick={handleClickStart}>Start</StyledButton>
      )}
    </>
  );
};

export default Board;

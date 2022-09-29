import { useEffect, useState } from "react";
import styled from "styled-components";
import Board from "./components/Board";

import cardTypes from "./data-json/card-types.json";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [randomList, setRandomList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCheckDone, setIsCheckDone] = useState();

  useEffect(() => {
    // Random cards
    (() => {
      const tmp = [];
      cardTypes.forEach((type) => {
        tmp.push({
          ...type,
          idKey: 1,
          isCorrect: false,
          isSelected: false,
        });
        tmp.push({
          ...type,
          idKey: 2,
          isCorrect: false,
          isSelected: false,
        });
      });
      setRandomList(shuffleCard(tmp));
    })();
  }, []);

  useEffect(() => {
    const tmp = [...randomList];
    // Handle check correct
    if (selectedItems.length === 2) {
      setIsCheckDone(false);
      if (selectedItems[0]?.code === selectedItems[1]?.code) {
        const code = selectedItems[0]?.code;
        tmp.forEach((item) => {
          if (item.code === code) {
            item.isCorrect = true;
          }
        });
        setRandomList(tmp);
      }
    }
    setIsCheckDone(true);
  }, [selectedItems]);

  useEffect(() => {
    if (isCheckDone) {
      setTimeout(() => {
        setSelectedItems([]);
      }, 1000);
    }
  }, [isCheckDone]);

  function shuffleCard(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  function handleSelectCard(card) {
    if (selectedItems.length > 1) {
      setSelectedItems([card]);
    } else {
      setSelectedItems([...selectedItems, card]);
    }
  }

  function handleStart() {
    const tmp = [...randomList];
    tmp.forEach((item) => {
      item.isSelected = true;
    });
    setRandomList(tmp);

    setTimeout(() => {
      tmp.forEach((item) => {
        item.isSelected = false;
      });
      setRandomList(tmp);
    }, 4000);
  }

  return (
    <Container>
      <div className="window" style={{ width: "820px" }}>
        <div className="title-bar">
          <div className="title-bar-text">Play Pick-Quickly</div>
        </div>
        <div className="window-body">
          <div style={{ display: "block" }}>
            <Board
              cardsList={randomList}
              handleSelectCard={handleSelectCard}
              onStart={handleStart}
              isCheckDone={isCheckDone}
            />
          </div>
        </div>
        <div className="status-bar">
          <p className="status-bar-field">Hi, stranger#919</p>
          <p className="status-bar-field">Coins: 693</p>
          <p className="status-bar-field">Press F1 for help</p>
        </div>
      </div>
    </Container>
  );
}

export default App;

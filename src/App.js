import { useEffect, useState } from "react";
import styled from "styled-components";
import Board from "./components/Board";
import Finish from "./components/Finish";

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
  const [isFinish, setIsFinish] = useState(false);
  const [startTime, setStartTime] = useState();
  const [totalTime, setTotalTime] = useState();
  const [isOnline, setIsOnline] = useState(true);
  const [record, setRecord] = useState();

  useEffect(() => {
    // Get record
    const found = localStorage.getItem("record");
    if (found) {
      setRecord(found);
    } else {
      setRecord(null);
    }

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
    if (selectedItems.length) {
      if (
        selectedItems[selectedItems.length - 2]?.code ===
          selectedItems[selectedItems.length - 1]?.code &&
        selectedItems[selectedItems.length - 2]?.idKey !==
          selectedItems[selectedItems.length - 1]?.idKey
      ) {
        const code = selectedItems[selectedItems.length - 2]?.code;
        tmp.forEach((item) => {
          if (item.code === code) {
            item.isCorrect = true;
          }
        });
        setRandomList(tmp);
      }
    }
  }, [selectedItems]);

  useEffect(() => {
    if (!randomList.length) return;
    checkFinish();
  }, [randomList]);

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
    setSelectedItems([...selectedItems, card]);
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
      setStartTime(new Date());
    }, 4000);
  }

  function checkFinish() {
    const tmp = randomList.filter((item) => item.isCorrect === false);
    if (!tmp.length) {
      setIsFinish(true);

      const timeRecord = (new Date() - startTime) / 1000;
      setTotalTime(`${timeRecord} seconds `);

      // check localStorage
      const foundItem = localStorage.getItem("record");
      if (foundItem) {
        if (timeRecord < foundItem) {
          localStorage.setItem("record", timeRecord);
        }
      } else {
        localStorage.setItem("record", timeRecord);
      }
    }
  }

  return (
    <Container>
      <div className="window" style={{ width: "820px" }}>
        <div className="title-bar">
          <div className="title-bar-text">Flip Quick</div>
          {isFinish && (
            <div class="title-bar-controls">
              <button
                aria-label="Close"
                onClick={() => window.location.reload(false)}
              ></button>
            </div>
          )}
        </div>
        <div className="window-body">
          <div style={{ display: "block" }}>
            {isFinish ? (
              <Finish totalTime={totalTime} />
            ) : (
              <Board
                cardsList={randomList}
                handleSelectCard={handleSelectCard}
                onStart={handleStart}
              />
            )}
          </div>
        </div>
        <div className="status-bar">
          <p className="status-bar-field">Hi, stranger#322</p>
          <p className="status-bar-field">
            {record ? `Record: ${record}s` : "No record"}
          </p>
          <p
            className="status-bar-field"
            onClick={() => setIsOnline(!isOnline)}
          >
            <span
              style={{ color: isOnline ? "green" : "red", marginRight: "5px" }}
            >
              ◉
            </span>
            {isOnline ? "Online" : "Busy"}
          </p>
        </div>
      </div>
    </Container>
  );
}

export default App;

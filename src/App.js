import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import Board from "./components/Board";
import Finish from "./components/Finish";
import Loader from "./components/Loader";

// SOUNDS
import gameSound from "./assets/sounds/game.ogg";
import startSound from "./assets/sounds/start.wav";
import finishSound from "./assets/sounds/finish.wav";

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
  const [userData, setUserData] = useState();
  const [roomData, setRoomData] = useState();
  const [strangerCode, setStrangerCode] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get record
    const found = localStorage.getItem("record");
    if (found) {
      setRecord(found);
    } else {
      setRecord(null);
    }

    // Random cards
    shuffleCard();

    // Random stranger's code 1-1000
    setStrangerCode(Math.round(Math.random() * 1000));

    // Play sound
    document.addEventListener("mousemove", (e) => {
      document.getElementById("bgSound").play();
    });

    return () => {
      document.removeEventListener("mousemove", (e) => {});
    };
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

  function shuffleCard() {
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

    let currentIndex = tmp.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [tmp[currentIndex], tmp[randomIndex]] = [
        tmp[randomIndex],
        tmp[currentIndex],
      ];
    }

    setRandomList(tmp);
  }

  function handleSelectCard(card) {
    setSelectedItems([...selectedItems, card]);
  }

  function handleStart() {
    // Play sound
    document.getElementById("startSound").play();

    const tmp = [...randomList];

    setTimeout(() => {
      tmp.forEach((item) => {
        item.isSelected = true;
      });
      setRandomList(tmp);
    }, 1000); // Loading image time

    setTimeout(() => {
      tmp.forEach((item) => {
        item.isSelected = false;
      });
      setRandomList(tmp);
      setStartTime(new Date());
    }, process.env.REACT_APP_SHOWTIME);
  }

  function checkFinish() {
    const tmp = randomList.filter((item) => item.isCorrect === false);
    if (!tmp.length) {
      setIsFinish(true);
      handleFinish();
    }
  }

  function handleRestart() {
    const tmp = randomList.map((item) => ({
      ...item,
      isCorrect: false,
      isSelected: false,
    }));
    setRandomList(tmp);
    setIsFinish(false);
    setSelectedItems([]);
    shuffleCard();
  }

  async function handleJoinRoom() {
    let tmp = prompt("Please enter room ID");
    if (!tmp) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/rooms/${tmp}`
      );
      setRoomData(response.data.data);
    } catch (err) {
      toast.error("Room ID is invalid!");
    }
    setIsLoading(false);
  }

  async function handleLogin() {
    let username = prompt("Please enter your username");
    if (!username) return;
    let password = prompt("Please enter your password");
    if (!password) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signin`,
        {
          username,
          password,
        }
      );
      setUserData(response.data);
      setRecord(response.data.record);
      toast.success("Login successfully!");
    } catch (err) {
      toast.error("Wrong credentials!");
    }
    setIsLoading(false);
  }

  async function assignLog(log) {
    if (!roomData) return;

    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/rooms/assignLog`, {
        roomId: roomData?._id,
        log,
      });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }

  function handleFinish() {
    // Play sound
    document.getElementById("finishSound").play();

    const timeRecord = (new Date() - startTime) / 1000;
    setTotalTime(`${timeRecord} seconds`);

    if (userData) {
      // check user record
      if (timeRecord < userData.record) {
        // set record of user to new value
        (async () => {
          await axios.post(`${process.env.REACT_APP_API_URL}/users/setRecord`, {
            userId: userData._id,
            record: timeRecord,
          });
        })();
        setUserData({
          ...userData,
          record: timeRecord,
        });
        setRecord(timeRecord);
      }
    } else {
      // check localStorage
      const foundItem = localStorage.getItem("record");
      if (foundItem) {
        if (timeRecord < foundItem) {
          localStorage.setItem("record", timeRecord);
          setRecord(timeRecord);
        }
      } else {
        localStorage.setItem("record", timeRecord);
        setRecord(timeRecord);
      }
    }

    // assign log
    if (userData) {
      assignLog(`${userData.username}: ${timeRecord}s`);
    } else {
      assignLog(`stranger#${strangerCode}: ${timeRecord}s`);
    }
  }

  function handleLeaveRoom() {
    setRoomData(null);
  }

  return (
    <Container>
      {isLoading && <Loader />}
      <div
        className="window"
        style={{
          width: "820px",
        }}
      >
        <div className="title-bar">
          <div className="title-bar-text">
            Flip Quick {roomData && `- Room#${roomData?._id}`}
          </div>
          {isFinish && (
            <div class="title-bar-controls">
              <button aria-label="Close" onClick={handleRestart}></button>
            </div>
          )}
        </div>
        <div className="window-body">
          <div style={{ display: "block" }}>
            {isFinish ? (
              <Finish totalTime={totalTime} roomId={roomData?._id} />
            ) : (
              <Board
                cardsList={randomList}
                handleSelectCard={handleSelectCard}
                onStart={handleStart}
                handleJoinRoom={handleJoinRoom}
                handleLeaveRoom={handleLeaveRoom}
                handleLogin={handleLogin}
                userData={userData}
                roomData={roomData}
              />
            )}
          </div>
        </div>
        <div className="status-bar">
          <p className="status-bar-field">
            Hi, {userData ? userData.username : `stranger#${strangerCode}`}
          </p>
          <p className="status-bar-field">
            {userData
              ? `${userData.record}s`
              : record
              ? `${record}s`
              : "No record"}
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
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        rtl={false}
      />

      {/* GAME SOUNDS */}
      <audio id="bgSound">
        <source src={gameSound} type="audio/ogg" />
      </audio>
      <audio id="startSound">
        <source src={startSound} type="audio/wav" />
      </audio>
      <audio id="finishSound">
        <source src={finishSound} type="audio/wav" />
      </audio>
    </Container>
  );
}

export default App;

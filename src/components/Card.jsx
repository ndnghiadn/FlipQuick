import React, { useEffect, useState } from "react";

const Card = ({ card, handleSelectCard }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShowStart, setIsShowStart] = useState(false);

  useEffect(() => {
    if (card.isSelected) {
      setIsShowStart(true);
      setTimeout(() => {
        setIsShowStart(false);
      }, process.env.REACT_APP_SHOWTIME);
    }
  }, [card.isSelected]);

  useEffect(() => {
    if (card.isCorrect) {
      return;
    } else {
      setTimeout(() => {
        setIsFlipped(false);
      }, 500);
    }
  }, [isFlipped, card.isCorrect]);

  const onSelectCard = () => {
    if (isShowStart) return;
    handleSelectCard(card);
    setIsFlipped(true);
  };

  return (
    <div
      onClick={onSelectCard}
      className={`flip-card--container ${card.isCorrect && "correct"} ${
        card.isSelected && "selected"
      }`}
    >
      <div className="flip-card">
        <div
          className={`flip-card-inner ${
            isFlipped || isShowStart || card.isCorrect ? "flipped" : ""
          }`}
        >
          <div className="flip-card-front">
            <img
              src="https://i.pinimg.com/originals/d6/3e/35/d63e35b31954db7a83f772702a348eb6.png"
              alt="Avatar"
            />
          </div>
          <div className="flip-card-back">
            <img src={card.src} alt="Avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

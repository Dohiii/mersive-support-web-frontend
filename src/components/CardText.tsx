import React from "react";

interface CardTextProps {
  text: string;
}

const CardText: React.FC<CardTextProps> = ({ text }) => {
  return <p>{text}</p>;
};

export default CardText;

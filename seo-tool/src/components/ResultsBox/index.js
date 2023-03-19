import React from "react";
import "./ResultsBox.css";

const ResultsBox = ({ checkData }) => {
  const renderGridItems = (data) => {
    const items = [];

    for (const property in data) {
      if (typeof data[property] !== "object") {
        if (property === "url") {
          continue;
        }
        if (property === "screenshot") {
          continue;
        }
      
        items.push(
          <div className="bg-white rounded-lg p-4" key={property}>
            <p className="text-lg mb-2">{property}:</p>
            <p>{data[property]}</p>
          </div>
        );
      }
    }

    return items;
  };

  return <div className="grid grid-cols-2 gap-4">{renderGridItems(checkData)}</div>;
};

export default ResultsBox;

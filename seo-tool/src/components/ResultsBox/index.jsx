import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ResultsBox.css";

const ResultsBox = ({ pageData }) => {
  const renderGridItems = (pageData) => {
    const items = [];
  
    for (const property in pageData) {
      if (typeof pageData[property] === "object") {
        items.push(
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-80 shadow-md" key={property}>
            <p className="text-xl"><b> {pageData[property].title}</b></p>
            <p className="text-md mb-2">
                {pageData[property].description}
             </p>
            
             
          </div>
        );
      }  
    }

    // Slider settings
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      swipeToSlide: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }

      ],
    };

    return (
      <Slider {...settings}>
        {items}
      </Slider>
    );
  };

  return (
    <div className="w-full">{renderGridItems(pageData)}</div>
  );
};

export default ResultsBox;

"use client";

import { useState, useEffect } from "react";


export default function SearchPanel(params) {

  const { onTextSearchChange, onTogglePeriod, toggledPeriods, searchBoxText, setShowSearchPanel } = params;

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchEndX(0);
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    // console.log("Touch start: ", touchStartX, "Touch end: ", touchEndX, "Difference: ", touchStartX - touchEndX);

    if ((50 < touchEndX) && (touchStartX - touchEndX > 50)) { // Checks that supposed swipe is within relevant area and from right to left
      // console.log(`Show search panel before: ${true}`);
      setShowSearchPanel(false); // Close search panel
      // console.log("Search panel closed by swipe")
    }
  };

  useEffect(() => {
    // Add event listeners for touch events
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStartX, touchEndX]);
    
    return (
        <div className={`flex flex-col fixed left-0 z-20 h-full w-[16rem] bg-white shadow-xl pt-4 space-y-4 p-2`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        > {/* Search panel */}
        
        <input type="text" placeholder='Search by keyword or code' value={searchBoxText} onChange={onTextSearchChange} className='def-border p-3 placeholder-color'/> {/* Text filter */}
        
        <div className='flex flex-col'> {/* Period start filter */}
          <p>Starting in period</p>
          <div className='flex flex-row w-full justify-around border-gray-500'>
          {['1', '2', '3', '4', 'S'].map((period, index, array) => (
          <button
            key={period}
            value={period}
            onClick={onTogglePeriod}
            className={`border-l border-t border-b p-2 w-full h-full border-gray-500 md:hover:bg-gray-300 ${toggledPeriods.includes(period) ? 'bg-gray-300' : ''} ${index === 0 ? 'rounded-l-md' : ''} ${index === array.length - 1 ? 'border-r rounded-r-md' : ''}`}
          >
                <b>{period}</b>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
};

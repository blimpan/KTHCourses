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
        <div className={`flex flex-col fixed left-0 z-20 h-full w-[17rem] bg-white shadow-xl pt-4 space-y-4 p-2`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        > {/* Search panel */}
        
        <input type="text" placeholder='Search by keyword or code...' value={searchBoxText} onChange={onTextSearchChange} className='rounded-lg border border-kth-blue p-3 bg-white placeholder:text-gray-500'/> {/* Text filter */}
        
        <div className='flex flex-col'> {/* Period start filter */}
          <p className="pl-1">Filter by starting period</p>
          <div className='flex flex-row w-full justify-around border-white'>
          {['1', '2', '3', '4', 'S'].map((period, index, array) => (
          <button
            key={period}
            value={period}
            onClick={onTogglePeriod}
            className={`border-l border-t border-b p-2 w-full h-full bg-kth-blue border-white md:hover:bg-gray-400 ${toggledPeriods.includes(period) ? '!bg-gray-400' : ''} ${index === 0 ? 'rounded-l-md' : ''} ${index === array.length - 1 ? 'border-r rounded-r-md' : ''}`}
          >
                <p className="font-bold text-white">{period}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
};

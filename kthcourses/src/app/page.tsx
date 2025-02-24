"use client"

import React, { useEffect, useState } from 'react'

export default function Page() {
  
  const [searchText, setSearchText] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [toggledPeriods, setToggledPeriods] = useState<any[]>([]);

  async function fetchCourses() {
    const res = await fetch("/api/filter-courses", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        textSearch: searchText,
        periods: toggledPeriods
      }),
    });
    const data = await res.json();
    setCourses(data);
    console.log("API data in frontend looks like")
    console.log(data)
  }

  useEffect(() => {
    if (searchText) {
      fetchCourses();
    }
  }, [searchText, toggledPeriods]);

  let debounceTimeout: NodeJS.Timeout;
  function onTextSearchChange(event: React.ChangeEvent<HTMLInputElement>) {

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setSearchText(event.target.value);
    }, 300);
  }


  function onTogglePeriod(event: React.MouseEvent<HTMLButtonElement>) {
    const period = event.currentTarget.value;
    
    if (toggledPeriods.includes(period)) {
      setToggledPeriods(toggledPeriods.filter((p) => p !== period));
    } else {
      setToggledPeriods([...toggledPeriods, period]);
    }

  }

  return (
   <div className='flex debug h-screen'>
      <div className='flex flex-col debug h-screen w-min pt-4 space-y-4 p-3'> {/* Search panel */}
        
        <input type="text" placeholder='Search...' onChange={onTextSearchChange} className='def-border p-3 placeholder-color'/> {/* Text filter */}
        
        <div className='flex flex-col'> {/* Period start filter */}
          <p>Period</p>
          <div className='flex flex-row def-border'>
            {['1', '2', '3', '4', 'S'].map((period) => (
              <button
                key={period}
                value={period}
                onClick={onTogglePeriod}
                className={`px-7 py-3 border-l border-gray-500 hover:bg-gray-300 ${toggledPeriods.includes(period) ? 'bg-gray-300' : ''}`}
              >
                <b>{period}</b>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-col debug h-screen w-full pt-4 space-y-4 p-3'> {/* Course list */}
        <p>Search results:</p>
        {courses.length > 0 ? (
          <>
          <ul>
            {courses.map((course) => (
              <li key={course.id}>{course.course_code + " " + course.name}</li>
            ))}
          </ul>
          
          <div className='flex flex-row w-full h-min'>
            <p className='text-lg font-bold'>{courses[0].course_code}</p>
          </div>

          </>
        ) : (
          <p>No courses found</p>
        )}
      </div>
   </div>
  )
}
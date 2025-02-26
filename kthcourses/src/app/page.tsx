"use client"

import CourseCard from './components/CourseCard'
import React, { useEffect, useState } from 'react'

export default function Page() {
  
  const [searchText, setSearchText] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [toggledPeriods, setToggledPeriods] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [maxPageIndex, setMaxPageIndex] = useState<number>(100);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const [readyForFetch, setReadyForFetch] = useState<boolean>(false);

  let debounceTimeout: NodeJS.Timeout;

  async function fetchCourses() {

    // console.log(`Starting fetchCourses with loadedPages: ${loadedPages}, pageIndex: ${pageIndex}, toggledPeriods ${toggledPeriods}`);

    if (maxPageIndex > 0 && pageIndex > maxPageIndex) {
      console.log('Max page index reached');
      return;
    }

    if (loadedPages.includes(pageIndex)) {
      console.log(`Page ${pageIndex} already loaded`);
      return;
    }

    const res = await fetch("/api/filter-courses", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        textSearch: searchText,
        periods: toggledPeriods,
        limit_count: 20,
        page_index: pageIndex
      }),
    });

    setLoadedPages((prevPages) => [...prevPages, pageIndex]);

    const data = await res.json();
    setCourses((prevCourses) => [...prevCourses, ...data.courses]);
    setTotalCourses(data.count);
    setMaxPageIndex(data.maxPageIndex);

    console.log(data.courses)
    // console.log(data.count)
  }

  useEffect(() => {
    if (searchText) {
      setPageIndex(1); // Reset page to 1
      setLoadedPages([]); // Clear loaded pages
      setTotalCourses(0); // Reset total count
      setCourses([]); // Clear previous courses
      setReadyForFetch(true); // Indicate that we should fetch courses after state updates
    }
  }, [searchText, toggledPeriods]);

  useEffect(() => {
    if (readyForFetch) {
      fetchCourses();
      setReadyForFetch(false); // Reset the flag
    }
  }, [readyForFetch]);

  useEffect(() => {
    function handleScroll() {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    
      debounceTimeout = setTimeout(() => {
        const scrollPosition = window.innerHeight + window.scrollY; // height of viewport + vertical scroll position
        const threshold = document.documentElement.scrollHeight * 0.8;
    
        if (scrollPosition >= threshold) {
          setPageIndex((prevIndex) => prevIndex + 1);
          console.log('Page index increased');
        }
      }, 100);
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (pageIndex > 1) {
      fetchCourses();
    }
  }, [pageIndex]);

  function onTextSearchChange(event: React.ChangeEvent<HTMLInputElement>) {

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setSearchText(event.target.value.trim());
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

        {totalCourses > 0 && (
          <p>Showing {courses.length} of {totalCourses} courses</p>
        )}
        
        {courses.length > 0 ? (
          <>
          
            {courses.map((course) => (

                <CourseCard key={course.id} 
                title={course.course_code + " " + course.name}
                />

            ))}
          
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
"use client"

import CourseCard from '@/app/components/CourseCard'
import SearchPanel from '@/app/components/SearchPanel'
import React, { useEffect, useState } from 'react'

export default function Page() {

  // VARIABLES
  
  const [searchText, setSearchText] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [toggledPeriods, setToggledPeriods] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [maxPageIndex, setMaxPageIndex] = useState<number>(100);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const [readyForFetch, setReadyForFetch] = useState<boolean>(false);

  let debounceTimeout: NodeJS.Timeout;

  // DECLARED FUNCTIONS

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

  function onTextSearchChange(event: React.ChangeEvent<HTMLInputElement>) {

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setSearchText(event.target.value.trim());
    }, 200);
  }


  function onTogglePeriod(event: React.MouseEvent<HTMLButtonElement>) {
    const period = event.currentTarget.value;
    
    if (toggledPeriods.includes(period)) {
      setToggledPeriods(toggledPeriods.filter((p) => p !== period));
    } else {
      setToggledPeriods([...toggledPeriods, period]);
    }

  }

  // EFFECTS

  useEffect(() => { // Fetch courses when search text changes or toggled periods change. Resets variables to ensure a fresh fetch can be made.
    if (searchText) {
      setPageIndex(1);
      setLoadedPages([]);
      setTotalCourses(0);
      setCourses([]);
      setReadyForFetch(true); // Indicate that we should fetch courses after state updates
    }
  }, [searchText, toggledPeriods]);

  useEffect(() => { // Fetch courses when readyForFetch flag is set to true (makes sure vars such as page index are reset before entering fetchCourses)
    if (readyForFetch) {
      fetchCourses();
      window.scrollTo(0, 0);
      setReadyForFetch(false);
    }
  }, [readyForFetch]);

  useEffect(() => { // Increases the page index when user scrolls close to the bottom of the window. Uses a debounce timeout to prevent multiple increments.
  
    function handleScroll() {

      const scrollPosition = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight - (window.innerHeight * 0.3);

      if (scrollPosition >= threshold) {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
  
        debounceTimeout = setTimeout(() => {
          setPageIndex((prevIndex) => prevIndex + 1);
          console.log('Page index increased');
        }, 100);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  
  useEffect(() => {  // Fetch "next page" of courses whenever page index changes
    if (pageIndex > 1) {
      fetchCourses();
    }
  }, [pageIndex]);


  return (
   <div className='flex h-screen'>

      <SearchPanel 
        onTextSearchChange={onTextSearchChange}
        onTogglePeriod={onTogglePeriod}
        toggledPeriods={toggledPeriods}
      />

      <div className='ml-[17.3rem] flex flex-col h-full w-full pt-4 space-y-4 p-3'> {/* Course list */}

        {totalCourses > 0 && (
          <p>Showing {courses.length} of {totalCourses} courses</p>
        )}
        
        {courses.length > 0 ? (
          <>
          
            {courses.map((course) => (

                <CourseCard key={course.id} 
                title={course.course_code + " " + course.name}
                description={course.content}
                ects={course.ects_credits}
                />

            ))}
            
          </>
        ) : (
          <p>No courses found</p>
        )}

      </div>
      
   </div>
  )
}
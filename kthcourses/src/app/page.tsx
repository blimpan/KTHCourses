"use client"

import CourseCard from '@/app/components/CourseCard'
import SearchPanel from '@/app/components/SearchPanel'
import LoadingGif from '@/app/components/LoadingGif'
import React, { useEffect, useState, useRef } from 'react'

export default function Page() {

  // VARIABLES
  
  const [searchText, setSearchText] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [toggledPeriods, setToggledPeriods] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [maxPageIndex, setMaxPageIndex] = useState<number>(100);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const [readyForFetch, setReadyForFetch] = useState<boolean>(false);
  const [showSearchPanel, setShowSearchPanel] = useState<boolean>(false);
  const [searchBoxText, setSearchBoxText] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchIdRef = useRef<number>(0);

  const persistData = {searchText: searchText, toggledPeriods: toggledPeriods};
  let debounceTimeout: NodeJS.Timeout;
  let scrollDebounceTimeout: NodeJS.Timeout;

  // DECLARED FUNCTIONS

  async function fetchCourses() {
    // console.log(`Starting fetchCourses with searchText ${searchText}`);

    // if (isFetching) return; // Prevent concurrent fetches
    setIsFetching(true);

    // Generate a unique ID for this fetch operation
    const currentFetchId = fetchIdRef.current + 1;
    fetchIdRef.current = currentFetchId;

    if (maxPageIndex > 0 && pageIndex > maxPageIndex) {
      console.log('Max page index reached');
      setIsFetching(false);
      return;
    }

    if (loadedPages.includes(pageIndex)) {
      console.log(`Page ${pageIndex} already loaded`);
      setIsFetching(false);
      return;
    }

    // console.log(`Fetching with searchText ${searchText}`);
    try {
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

      // Check if this is still the latest fetch
      if (currentFetchId !== fetchIdRef.current) {
        // console.log(`Ignoring outdated fetch response with ID ${currentFetchId} and searchText ${searchText}`);
        setIsFetching(false);
        return;
      }

      const data = await res.json();
      
      // For page 1, replace courses; for other pages, append
      if (pageIndex === 1) {
        setCourses(data.courses);
      } else {
        setCourses(prevCourses => {
          // Create a Set of existing course IDs to avoid duplicates
          const existingIds = new Set(prevCourses.map(course => course.id));
          // Only add courses that don't already exist in the state
          const newCourses = data.courses.filter((course: { id: number }) => !existingIds.has(course.id));
          return [...prevCourses, ...newCourses];
        });
      }
      
      setLoadedPages(prevPages => [...prevPages, pageIndex]);
      setTotalCourses(data.count);
      setMaxPageIndex(data.maxPageIndex);

      console.log(data.courses);
      console.log(`Fetch completed for searchText ${searchText} and ID ${currentFetchId}`);
      // console.log(data.count);
    } catch (error) {
      console.error("(From frontend) Error fetching courses:", error);
    } finally {
      setIsFetching(false);
    }
  }

  function onTextSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchBoxText(event.target.value);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setSearchText(event.target.value.trim());
    }, 350);
  }

  function onTogglePeriod(event: React.MouseEvent<HTMLButtonElement>) {
    const period = event.currentTarget.value;
    
    if (toggledPeriods.includes(period)) {
      setToggledPeriods(toggledPeriods.filter((p) => p !== period)); // Remove period from toggledPeriods
    } else {
      setToggledPeriods([...toggledPeriods, period]); // Add period to toggledPeriods
    }
  }

  // EFFECTS

  useEffect(() => {
    // console.log('Checking session storage');

    const savedSearchText = sessionStorage.getItem('searchText');
    const savedToggledPeriods = sessionStorage.getItem('toggledPeriods');
      
    if (savedSearchText) {
      setSearchBoxText(savedSearchText.slice(1, -1));
      setSearchText(savedSearchText.slice(1, -1));
      // console.log('Search text loaded from session storage');
    };
    
    if (savedToggledPeriods) {
      setToggledPeriods(JSON.parse(savedToggledPeriods));
      // console.log(`Toggled periods loaded from session storage: ${savedToggledPeriods}`);
    };

  }, []);

  useEffect(() => { // Fetch courses when search text changes or toggled periods change. Resets variables to ensure a fresh fetch can be made.
    if (searchText) {
      // Reset pagination variables
      setPageIndex(1);
      setLoadedPages([]);
      
      
      // setTotalCourses(0);
      // setCourses([]);
      
      setReadyForFetch(true); // Indicate that we should fetch courses after state updates
    }
  }, [searchText, toggledPeriods]);

  useEffect(() => { // Fetch courses when readyForFetch flag is set to true (makes sure vars such as page index are reset before entering fetchCourses)
    if (readyForFetch) {
      fetchIdRef.current += 1;
      fetchCourses();
      window.scrollTo(0, 0);
      setReadyForFetch(false);
    }
  }, [readyForFetch]);

  useEffect(() => { // Increases the page index when user scrolls close to the bottom of the window. Uses a debounce timeout to prevent multiple increments.
    
    function handleScroll() {
      const scrollPosition = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight - (window.innerHeight * 0.3);

      if (scrollPosition >= threshold && !isFetching) {
        if (scrollDebounceTimeout) {
          clearTimeout(scrollDebounceTimeout);
        }
  
        scrollDebounceTimeout = setTimeout(() => {
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
   <div className='flex h-full w-full'>

      <div className={`fixed left-0 z-20 h-full w-min min-w-[15rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${showSearchPanel ? 'translate-x-0' : '-translate-x-[110%]'}`}>
        <SearchPanel
          onTextSearchChange={onTextSearchChange}
          onTogglePeriod={onTogglePeriod}
          toggledPeriods={toggledPeriods}
          searchBoxText={searchBoxText}
          setShowSearchPanel={setShowSearchPanel}
        />
      </div>

      {!showSearchPanel ? (
        <button
          className="md:hidden fixed bottom-6 left-6 z-20 flex items-center justify-center w-14 h-14 bg-white shadow-lg rounded-full border border-gray-300 transition"
          onClick={() => {
            setShowSearchPanel(true);
            console.log('Search panel opened');
          }}
        >
          🔍
        </button>
      ) : (
        <button
          className="md:hidden text-2xl pb-1 fixed bottom-6 left-6 z-20 flex items-center justify-center w-14 h-14 bg-white shadow-lg rounded-full border border-gray-300 transition"
          onClick={() => {
            setShowSearchPanel(false);
            console.log('Search panel closed');
          }}
        >
          x
        </button>
      )}

      <div className='md:ml-[16rem] z-0 flex flex-col w-full h-full pt-4 space-y-4 p-4'
            onClick={() => setShowSearchPanel(false)}> {/* Course list */}

        {courses.length == 0 && isFetching && (
          <LoadingGif />
        )}

        {courses.length == 0 && !isFetching && (
          <div className='flex justify-center mt-16'>
            <div className='flex w-fit justify-center bg-white drop-shadow-md rounded-lg p-4 animate-card-fade-in'>
              <p className='text-center'>No courses match the current search parameters. <br/>Tip: Try some other ones.</p>
            </div>
          </div>
        )}

        {courses.length > 0  && (
          <p>Showing {courses.length} of {totalCourses} courses</p>
        )}
        
        {courses.length > 0 &&  (
          <>
            {courses.map((course) => (
                <CourseCard key={course.id}
                code={course.course_code}
                name={course.name}
                description={course.content}
                ects={course.ects_credits}
                searchPanelShowing={showSearchPanel}
                persistData={persistData}
                />
            ))}
          </>
        )}
      </div>
   </div>
  )
}
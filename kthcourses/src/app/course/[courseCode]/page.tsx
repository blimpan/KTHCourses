'use client'; // This marks the component as a client-side component

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import LoadingGif from '@/app/components/LoadingGif'
import { Course } from '@/app/types';


const CoursePage = ({ params }: { params: Promise<{ courseCode: string }> }) => {
    const [courseDetails, setCourseDetails] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [courseCode, setCourseCode] = useState<string>("");
    const [hasContent, setHasContent] = useState(false);

    // Extract courseCode from params and store it in state
    useEffect(() => {
        const fetchCourseCode = async () => {
            const resolvedParams = await params; // Await the Promise to get the params
            setCourseCode(resolvedParams.courseCode); // Set the courseCode to state
        };

        fetchCourseCode();
    }, [params]);

    // Fetch course details once courseCode is available
    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (courseCode) {
                const res = await fetch(`/api/get-course`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseCode }),
                });

                if (res.ok) {
                    const { course }  = await res.json();
                    setCourseDetails(course);
                    console.log(`Course in frontend`, course);
                } else {
                    setIsLoading(false);
                    notFound(); // Handle 404 or other errors
                }
                setIsLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseCode]); // Trigger effect when courseCode is set

    useEffect(() => {
        if (courseDetails) {
            setHasContent(
                !!(courseDetails.content || courseDetails.goals || courseDetails.ai_summary) // Check if any of the content fields are present. If any of them are present, setHasContent to true
            );
        }
    }, [courseDetails]);

    // Function to decode HTML entities in course content
    function decodeHtmlEntities(htmlStr: string): string {
        const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
        return doc.documentElement.textContent || '';
    }

    // Turns a string (ex. "1, 2, 3") into a string of periods (ex. "P1, P2, P3")
    function formatStartPeriods(periods: string): string {
        return periods
            .split(',')
            .map((period) => `P${period.trim()}`)
            .join(', ');
    }

    if (isLoading) {
        return <LoadingGif />;
    }

    if (!isLoading && !courseDetails) { // Course not found
        return (
            <div className="flex flex-col flex-grow gap-4 bg-white p-4 animate-card-fade-in">
                <h1 className="text-2xl font-semibold">Course not found</h1>
                <p>Sorry, we couldn&apos;t find any information about this course.</p>
            </div>
        )
    }

    if (!isLoading && courseDetails) {
        return (
            <div className="flex flex-col flex-grow gap-6 bg-white p-4 animate-card-fade-in">
                
                <h1 className="text-2xl font-semibold">
                    {courseDetails.course_code} {courseDetails.name}
                </h1>

                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row -mt-2 md:mt-0"> {/* Course details */}
                    
                    <div className='flex flex-col space-y-2 min-w-72 md:w-1/3 '> {/* Contains Credits & School + Starts & Level */}

                        <div className="flex flex-row"> {/* Credits and school */}
                            
                            <div className="flex flex-col w-1/2">
                                
                                <div className='flex flex-col w-min text-center'>
                                    <div className='flex flex-row space-x-2'>
                                        <p>📚</p>
                                        <p className='font-normal'>Credits</p>
                                    </div>    
                                    <p className='font-light'>{courseDetails.ects_credits} ECTS</p>
                                </div>

                            </div>

                            <div className="flex flex-col w-1/2">
                                
                                <div className='flex flex-col w-min text-center'>
                                    <div className='flex flex-row space-x-2'>
                                        <p className='relative top-[-3px]'>🏫</p>
                                        <p className='font-normal'>School</p>
                                    </div>    
                                    <p className='font-light'>{courseDetails.school}</p>
                                </div>

                            </div>
                            
                        </div>

                        <div className="flex flex-row"> {/* Starts and level */}
                            
                            <div className="flex flex-col w-1/2">
                                
                                <div className='flex flex-col w-min text-center'>
                                    <div className='flex flex-row space-x-2'>
                                        <p>🗓️</p>
                                        <p className='font-normal'>Starts</p>
                                    </div>    
                                    <p className='font-light'>{formatStartPeriods(courseDetails.start_periods)}</p>
                                </div>

                            </div>

                            <div className="flex flex-col w-1/2">
                                
                                <div className='flex flex-col w-min text-center'>
                                    <div className='flex flex-row space-x-2'>
                                        <p>🎓</p>
                                        <p className='font-normal'>Level</p>
                                    </div>    
                                    <p className='whitespace-nowrap font-light'>{courseDetails.edu_level}</p>
                                </div>

                            </div>
                            
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2"> {/* Examiners and official link */}
                        
                        <div className="flex flex-col">
                            
                            <div className='flex flex-col text-left'>
                                <div className='flex flex-row space-x-2'>
                                    <p>👤</p>
                                    <p className='font-normal'>Examiners</p>
                                </div>
                                <p className='font-light'>{courseDetails.examiners}</p>
                            </div>

                        </div>

                        <div className="flex flex-col">
                            
                            <div className='flex flex-row'>
                                <div className='flex flex-row items-center space-x-2'>
                                    <img src="/images/kth-logo.svg" alt="KTH logo" width={22} className='aspect-square object-contain rounded-sm' />
                                    <a className="whitespace-nowrap text-kth-blue" target='_blank' href={`https://www.kth.se/student/kurser/kurs/${courseDetails.course_code}?l=en`}> Link to official KTH page </a>
                                </div>    
                            </div>

                        </div>
                        
                    </div>

                </div>

                {hasContent ? (
                    <div className="flex flex-col space-y-1"> {/* Table of Contents */}
                        
                        <h2 className="text-lg font-semibold">Table of Contents</h2>

                        <div className="border-l border-black pl-4 ml-1">
                            <ul className="space-y-4">
                                {courseDetails.ai_summary && (
                                    <li>
                                        <a href="#ai-overview" className="text-kth-blue">AI Overview</a>
                                    </li>
                                )}
                                {courseDetails.content && (
                                    <li>
                                        <a href="#course-content" className="text-kth-blue">Course Content</a>
                                    </li>
                                )}
                                {courseDetails.goals && (
                                    <li>
                                        <a href="#course-goals" className="text-kth-blue">Intended Learning Outcomes</a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">Hmm that&apos;s strange...</h2>
                        <p>We couldn&apos;t find more information about this course. Maybe try the official KTH version?</p>
                    </div>
                )}


                {courseDetails.ai_summary && (
                    <div className="flex flex-col" id='ai-overview'> {/* AI Summary */}
                        <h2 className="text-lg font-semibold">AI Overview</h2>
                            <p className='font-light'>{courseDetails.ai_summary}</p>
                    </div>
                )}

                {courseDetails.content && (
                    <div className="" id='course-content'> {/* Course Content */}
                        <h2 className="text-lg font-semibold">Course Content</h2>
                        <div className="rich-text font-light" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(courseDetails.content) }}></div>
                    </div>
                )}

                {courseDetails.goals && (
                    <div className="" id='course-goals'> {/* Course Goals */}
                        <h2 className="text-lg font-semibold">Intended Learning Outcomes</h2>
                        <div className="rich-text font-light" dangerouslySetInnerHTML={{ __html: courseDetails.goals }}></div>
                    </div>
                )}

            </div>
        );
    };
};

export default CoursePage;

'use client'; // This marks the component as a client-side component

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import LoadingGif from '@/app/components/LoadingGif'
import { Course } from '@/app/types';
import PreviewWrapper from '@/app/components/PreviewWrapper';


const CoursePage = ({ params }: { params: Promise<{ courseCode: string }> }) => {
    const [courseDetails, setCourseDetails] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [courseCode, setCourseCode] = useState<string>("");

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

    // Function to decode HTML entities in course content
    function decodeHtmlEntities(htmlStr: string): string {
        const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
        return doc.documentElement.textContent || '';
    }

    if (isLoading) {
        return <LoadingGif />;
    }

    if (!isLoading && !courseDetails) { // Course not found
        return <p>Course not found</p>;
    }

    if (!isLoading && courseDetails) {
        return (
            <div className="flex flex-col h-full space-y-3 bg-white p-3 animate-card-fade-in">
                <div className=""> {/* Header with course title and ECTS credits */}
                    <h1 className="text-xl font-semibold">
                        {courseDetails.course_code} {courseDetails.name}
                    </h1>
                    <div className="flex flex-row space-x-2">
                        <p className="">
                            {courseDetails.ects_credits} ECTS • School: {courseDetails.school} • {courseDetails.edu_level}  • <a className="underline text-nowrap" target='_blank' href={`https://www.kth.se/student/kurser/kurs/${courseDetails.course_code}?l=en`}> Link to official page </a>
                        </p>
                    </div>
                </div>


                {courseDetails.ai_summary && (
                    <div className="flex flex-col"> {/* AI Summary */}
                        <h2 className="text-lg font-semibold">AI Summary</h2>
                        <PreviewWrapper>
                            <p>{courseDetails.ai_summary}</p>
                        </PreviewWrapper>
                    </div>
                )}


                {courseDetails.content && (
                    <div className=""> {/* Course Content */}
                        <h2 className="text-lg font-semibold">Course Content</h2>
                        <div className="rich-text" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(courseDetails.content) }}></div>
                    </div>
                )}

                {courseDetails.goals && (
                    <div className=""> {/* Course Goals */}
                        <h2 className="text-lg font-semibold">Intended Learning Outcomes</h2>
                        <div className="rich-text" dangerouslySetInnerHTML={{ __html: courseDetails.goals }}></div>
                    </div>
                )}

                <div className=""> {/* Examiners */}
                    <h2 className="text-lg font-semibold">Examiners</h2>
                    <p>{courseDetails.examiners}</p>
                </div>
            </div>
        );
    };
};

export default CoursePage;

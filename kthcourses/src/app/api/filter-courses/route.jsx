

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'


export async function POST(request) {
    try {
        const startTotal = performance.now();


        const body = await request.json(); // Parse JSON body
        let { limit_count, page_index } = body;
        const { textSearch, periods } = body;
        
        const cookieStore = cookies() // Remove await if cookies() is not a promise
        const supabase = createClient(cookieStore)
        

        if (textSearch === "" && periods.length < 1) {
            return Response.json({courses: [], count: 0});
        }

        if (limit_count === undefined || limit_count < 1 || limit_count > 20) {
            limit_count = 10;
        }

        if (page_index === undefined || page_index < 1) {
            page_index = 1;
        }

        const pagOffset = (page_index - 1) * limit_count;

        console.log(`\n *** Fetching courses with the following params ***`)
        console.log(`text: '${textSearch}'   periods: '${periods}'`);
        console.log(`limit_count: ${limit_count}    page_index: ${page_index} \n`);

        const startDB = performance.now(); // Start timing DB call

        const { data, error } = await supabase
        .rpc('search_courses', { 
            search_term: textSearch, 
            periods: periods,
            limit_count: limit_count,
            pagination_offset: pagOffset
        });

        const endDB = performance.now(); // End timing DB call
        console.log(`🟢 Database query time: ${(endDB - startDB).toFixed(2)}ms`);

        if (error) {
            console.error('Error from Supabase:', error); // Debugging
            return new Response('Error fetching courses', { status: 500 });
        } else {
            // console.log('Courses fetched:', data); // Debugging
    
        }

        const startProcessing = performance.now();

        // Flatten the response by merging attributes of course_main into the course_title objects
        const flattenedCourses = data.map((course) => ({
            ...course  // Spread the course attributes
        }));

        console.log(`Flattened length: ${flattenedCourses.length}`);

        let totalCount = 0;
        if (flattenedCourses.length > 0) {
            totalCount = flattenedCourses[0].total_count;
        }

        const maxPageIndex = Math.ceil(totalCount / limit_count);
        console.log(`MaxPageIndex: ${maxPageIndex}`);

        const endProcessing = performance.now(); // End response processing time
        console.log(`🟡 Response processing time: ${(endProcessing - startProcessing).toFixed(2)}ms`);

        const endTotal = performance.now(); // End total request timing
        console.log(`🔵 Total API execution time: ${(endTotal - startTotal).toFixed(2)}ms`);


        return Response.json({courses: flattenedCourses, count: totalCount, maxPageIndex: maxPageIndex});
        
    } catch (error) {
        
        console.error('Error fetching courses:', error);
        return new Response('Bad Request', { status: 400 });
    }
}
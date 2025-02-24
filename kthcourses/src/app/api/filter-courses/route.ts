import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'


export async function POST(request: Request) {
    try {
        const body = await request.json(); // Parse JSON body
        let { textSearch, periods, limit_count } = body;

        const cookieStore = cookies() // Remove await if cookies() is not a promise
        const supabase = createClient(cookieStore)

        if (textSearch === "" && periods.length < 1) {
            return Response.json([]);
        }

        if (limit_count === undefined || limit_count < 1 || limit_count > 20) {
            limit_count = 10;
        }

        console.log('Fetching courses with text search:', textSearch);
        console.log('Fetching courses with periods:', periods);

        const { data, error } = await supabase
        .rpc('search_courses', { 
            search_term: textSearch, 
            periods: periods,
            limit_count: limit_count
        });

        if (error) {
            console.error('Error from Supabase:', error); // Debugging
            return new Response('Error fetching courses', { status: 500 });
        } else {
            console.log('Courses fetched:', data); // Debugging
        }

        // Flatten the response by merging attributes of course_main into the course_title objects
        const flattenedCourses = data.map(course => ({
            ...course,  // Spread the course_title attributes
            ...((course.course_main && course.course_main[0]) || {})  // Spread the first course_main object (or empty object if null)
        }));

        return Response.json(flattenedCourses);
        
    } catch (error) {
        
        console.error('Error fetching courses:', error);
        return new Response('Bad Request', { status: 400 });
    }
}
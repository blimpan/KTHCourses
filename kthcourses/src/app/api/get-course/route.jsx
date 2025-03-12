import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'


export async function POST(request) {
    try {
        const body = await request.json(); // Parse JSON body
        const { courseCode } = body;
        
        const cookieStore = cookies() // Remove await if cookies() is not a promise
        const supabase = createClient(cookieStore)
        

        if (courseCode === undefined ||  courseCode === '') {
            return new Response('Missing course code', { status: 400 });
        }

        console.log(`\n *** Fetching single course with the following params ***`)
        console.log(`courseCode: '${courseCode}'`);

        const { data, error } = await supabase
            .from('courses_main')
            .select('*')
            .eq('course_code', courseCode)
            .limit(1)
            .single()

        if (error) {
            console.error('Error from Supabase:', error); // Debugging
            return new Response('Error fetching single course', { status: 500 });
        } else {
            console.log('Course fetched:', data); // Debugging
        }

        return Response.json({course: data});
        
    } catch (error) {
        
        console.error('Error fetching single course:', error);
        return new Response('Bad Request', { status: 400 });
    }
}
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'


export async function POST(request: Request) {
    try {
        const body = await request.json(); // Parse JSON body
        const { textSearch } = body;

        const cookieStore = cookies() // Remove await if cookies() is not a promise
        const supabase = createClient(cookieStore)

        console.log('Fetching courses with text search:', textSearch);

        const { data, error } = await supabase
        .from('course_title')
        .select()
        // .ilike('title', `%${textSearch}%`)
        .or(`title.ilike.${textSearch}%,title.ilike.%${textSearch}%`) // Prioritize prefix matches
        .limit(10);

        if (error) {
            console.error('Error from Supabase:', error); // Debugging
            return new Response('Error fetching courses', { status: 500 });
        }

        return Response.json(data);
        
    } catch (error) {
        
        console.error('Error fetching courses:', error);
        return new Response('Bad Request', { status: 400 });
    }
}
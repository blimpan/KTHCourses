import { createClient } from '@/utils/supabase/server'
import { log } from 'console'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = cookies() // Remove await if cookies() is not a promise
  const supabase = createClient(cookieStore)

  const { data: courses, error } = await supabase
    .from('course_school')
    .select()
    .eq('school', 'EECS')
    .limit(10)

  log(courses)

  return (
    <ul>
      {courses?.map((course) => (
        <li key={course.id}>{course.course_code}</li>
      ))}
    </ul>
  )
}
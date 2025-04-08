import { useRouter } from 'next/navigation';
import { Course } from '@/app/types';


interface CourseCardProps { 
    course: Course;
    searchPanelShowing: boolean;
    persistData: object;   
}


export default function CourseCard( { course, searchPanelShowing, persistData }: Readonly<CourseCardProps>) {

    const router = useRouter();

    function onCardClick() {
        if (!searchPanelShowing) {
            
            for (const [key, value] of Object.entries(persistData)) {
                // console.log("Persisting data: " + key + " " + value);
                sessionStorage.setItem(key, JSON.stringify(value));
            }
            
              router.push(`/course/${course.course_code}`);       
        }
    }


    return (

        <button onClick={onCardClick} className={`flex flex-col w-full h-min bg-white default-comp-style text-left  transform transition-transform duration-200 hover:scale-[1.01]  ${!searchPanelShowing ? 'cursor-pointer' : ''}`}>

            <p className="text-lg font-medium text-kth-dark-blue">{course.course_code + " " + course.name}</p>
            
            <div className="flex flex-row justify-between text-sm">
                <p>{course.ects_credits} ECTS • {course.edu_level}</p>
            </div>

            {course.ai_summary && (
                <div className='h-15'>
                    <p className="text-sm line-clamp-3">{course.ai_summary}</p>
                </div>
            )}
            
        </button>
    );    
};

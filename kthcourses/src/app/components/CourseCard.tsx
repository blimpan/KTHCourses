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
        <div onClick={onCardClick} className={`flex flex-col w-full h-min bg-white drop-shadow-md transform transition-transform duration-200 hover:scale-[1.01] rounded-lg p-4 animate-card-fade-in ${!searchPanelShowing ? 'cursor-pointer' : ''}`}>
            <p className="text-lg font-medium">{course.course_code + " " + course.name}</p>
            
            <div className="flex flex-row justify-between text-sm">
                <p>{course.ects_credits} ECTS</p>
            </div>

            {course.ai_summary && (
                <p className="text-sm overflow-hidden whitespace-nowrap text-ellipsis">{course.ai_summary}</p>
            )}
            
        </div>
    );    
};

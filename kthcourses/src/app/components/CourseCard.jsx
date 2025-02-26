

export default function CourseCard(params) {
    return (
        <div className="flex debug w-full h-24 bg-white shadow-md rounded-lg p-4">
            <p>{params.title}</p>
        </div>
    );    
};

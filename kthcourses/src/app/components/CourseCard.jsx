

export default function CourseCard(params) {

    const maxDescriptionLength = 100; // number of characters

    return (
        <div className="flex flex-col min-w h-min bg-white drop-shadow-md rounded-lg p-4 hover:-translate-y-0.5 transition-transform ease-in-out">
            <p className="text-lg font-medium">{params.title}</p>
            
            <div className="flex flex-row justify-between text-sm">
                <p>{params.ects} ECTS</p>
            </div>

            <p className="text-sm">{params.description.length > maxDescriptionLength ? params.description.substring(0, maxDescriptionLength) + '...' : params.description}</p>
        </div>
    );    
};

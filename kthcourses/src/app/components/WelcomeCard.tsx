
export default function WelcomeCard() {
    
    return (
        <div className="default-comp-style !p-0 flex flex-col sm:flex-row  w-full h-full bg-white overflow-hidden">
            
            <div className="px-4 pt-4 sm:pb-4">

                <h1 className="font-bold text-lg whitespace-nowrap">What do you want to study?</h1>
                <p>KTH Courses is an interactive catalog of all courses at KTH</p>


                <ul className="mt-4 space-y-2 font-semibold">
                    <li className="flex items-center gap-2 whitespace-nowrap"> <img src="/images/green-checkmark.svg" alt="Green checkmark" width={30} /> 2000+ courses</li>
                    <li className="flex items-center gap-2 whitespace-nowrap"> <img src="/images/green-checkmark.svg" alt="Greenn checkmark" width={30} /> Easy to use search tool</li>
                    <li className="flex items-center gap-2 whitespace-nowrap "> <img src="/images/green-checkmark.svg" alt="Green checkmark" width={30} /> By students, for students</li>
                </ul>
            </div>


            <div className="@container relative grow mt-2 overflow-hidden rounded-lg h-[10rem] xs:h-[15rem] sm:h-auto">
                <img 
                    src="/images/kth-ellipse.webp" 
                    alt="KTH Logo"
                    className="absolute bottom-0 right-0 object-contain object-top top-0 h-[13rem] hidden @[96px]:block xs:h-[18rem] sm:object-right"
                />
            </div>

        </div>
    );
};


export default function WelcomeCard() {
    
    return (
        <div className="default-comp-style !p-0 flex flex-col sm:flex-row  w-full h-full bg-white">
            
            <div className="px-4 pt-4 sm:pb-4">
                <h1 className="font-bold text-xl text-nowrap">Welcome to KTH Courses</h1>
                <p>An interactive catalog of all courses at KTH</p>

                <ul className="mt-4 space-y-2 font-semibold">
                    <li className="flex items-center gap-2 text-nowrap"> <img src="/images/green-checkmark.svg" alt="Green checkmark" width={30} />2000+ courses</li>
                    <li className="flex items-center gap-2 text-nowrap"> <img src="/images/green-checkmark.svg" alt="Green checkmark" width={30} />Easy to use search tool</li>
                    <li className="flex items-center gap-2 text-nowrap"> <img src="/images/green-checkmark.svg" alt="Green checkmark" width={30} />By students, for students</li>
                </ul>
            </div>

            <div className="relative grow mt-2 overflow-clip rounded-lg h-[10rem] xs:h-[15rem] sm:h-auto">
                <img 
                    src="/images/kth-ellipse.webp" 
                    alt="KTH Logo"
                    className="absolute bottom-0 right-0 object-contain object-top top-0 h-[13rem] xs:h-[18rem] sm:object-right"
                />
            </div>
        </div>
    );
};

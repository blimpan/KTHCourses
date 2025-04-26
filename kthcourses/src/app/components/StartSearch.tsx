
interface StartSearchProps {
    openSidePanel: () => void;
}

export default function StartSearch({ openSidePanel }: Readonly<StartSearchProps>) {

    function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        openSidePanel();
    }

    return (
        <button className="flex items-center w-[135px] xs:w-[160px] h-[54px] xs:h-[60px] bg-white rounded-full pr-1 pl-2 shadow-md transform transition-transform duration-200 hover:scale-[1.02]"
            onClick={onClick}>
            <span className="text-xl text-kth-blue font-bold mx-auto">Start</span>
            <div className="aspect-square w-[3rem] xs:w-[3.25rem] bg-kth-blue rounded-full flex items-center justify-center">
                <img
                    src="/images/magnifier.svg"
                    alt="Mangifying glass"
                    className="aspect-square h-7"
                />
            </div>
        </button>
    );
};

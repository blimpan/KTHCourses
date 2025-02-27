export default function SearchPanel(params) {

    const { onTextSearchChange, onTogglePeriod, toggledPeriods } = params;
    
    return (
        <div className={`flex flex-col fixed left-0 z-20 h-full w-[16rem] bg-white shadow-xl pt-4 space-y-4 p-1`}> {/* Search panel */}
        
        <input type="text" placeholder='Search...' onChange={onTextSearchChange} className='def-border p-3 placeholder-color'/> {/* Text filter */}
        
        <div className='flex flex-col'> {/* Period start filter */}
          <p>Starting in period</p>
          <div className='flex flex-row w-full justify-around border-gray-500'>
          {['1', '2', '3', '4', 'S'].map((period, index, array) => (
          <button
            key={period}
            value={period}
            onClick={onTogglePeriod}
            className={`border-l border-t border-b p-2 w-full h-full border-gray-500 hover:bg-gray-300 ${toggledPeriods.includes(period) ? 'bg-gray-300' : ''} ${index === 0 ? 'rounded-l-md' : ''} ${index === array.length - 1 ? 'border-r rounded-r-md' : ''}`}
          >
                <b>{period}</b>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
};

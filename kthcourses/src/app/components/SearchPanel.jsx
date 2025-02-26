export default function SearchPanel(params) {

    const { onTextSearchChange, onTogglePeriod, toggledPeriods } = params;
    
    return (
        <div className='flex flex-col fixed h-full min-w bg-white shadow-xl pt-4 space-y-4 p-3'> {/* Search panel */}
        
        <input type="text" placeholder='Search...' onChange={onTextSearchChange} className='def-border p-3 placeholder-color'/> {/* Text filter */}
        
        <div className='flex flex-col'> {/* Period start filter */}
          <p>Starting in period</p>
          <div className='flex flex-row def-border'>
            {['1', '2', '3', '4', 'S'].map((period) => (
              <button
                key={period}
                value={period}
                onClick={onTogglePeriod}
                className={`px-5 py-2 border-l border-gray-500 hover:bg-gray-300 ${toggledPeriods.includes(period) ? 'bg-gray-300' : ''}`}
              >
                <b>{period}</b>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
};

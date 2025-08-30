import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabSwitch }) => {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const tabWidth = 100 / tabs.length;

  return (
    <div className="w-full animate-fadeIn">
      <div className="relative p-1 overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
        {/* Animated Background Slider */}
        <div
          className="absolute transition-all duration-500 ease-out rounded-md top-1 bottom-1 bg-sg-red"
          style={{
            width: `calc(${tabWidth}% - 0.125rem)`,
            left: `calc(${activeIndex * tabWidth}% + 0.125rem)`,
          }}
        />

        <nav className="relative flex w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabSwitch(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-800"
              } flex-1 py-4 px-1 rounded-md font-semibold text-xs transition-all duration-300 ease-out flex items-center justify-center space-x-1 relative z-10 hover:scale-[1.02] active:scale-[0.98]`}
            >
              <span className="transition-all duration-300">
                {tab.label}
              </span>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-sg-red"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;

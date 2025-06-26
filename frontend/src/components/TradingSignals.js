import React from 'react';

const TradingSignals = ({ signals, onSelect }) => (
  <div className="bg-[#181c24] text-white w-64 h-full flex flex-col border-r border-[#23272f]">
    <div className="p-4 border-b border-[#23272f] text-lg font-bold flex items-center justify-between">
      <span>Trading signals</span>
      <span className="text-xs text-blue-400 cursor-pointer">WHAT'S IT?</span>
    </div>
    <div className="flex-1 overflow-y-auto">
      {signals.map((signal, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between px-4 py-3 hover:bg-[#23272f] cursor-pointer border-b border-[#23272f]"
          onClick={() => onSelect(signal)}
        >
          <div className="flex flex-col">
            <span className="font-semibold text-sm flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              {signal.pair}
            </span>
            <span className="text-xs text-gray-400">Duration: {signal.duration}m</span>
          </div>
          <span className="text-xs text-blue-300 font-mono">{signal.time}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TradingSignals;

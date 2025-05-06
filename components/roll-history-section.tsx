"use client"

export default function RollHistorySection({ rolls, title, textColor }) {
  return (
    <div className="bg-black bg-opacity-80 p-4 h-full rounded-lg">
      <h3 className="text-lg font-bold mb-3 text-white">{title} History</h3>
      <div className="max-h-40 overflow-y-auto">
        {rolls.length > 0 ? (
          <ul className="space-y-2">
            {rolls.map((roll, index) => (
              <li key={index} className="text-sm border-b border-gray-900 pb-1 text-white">
                <span className={textColor}>{roll.roller}</span> rolled: {roll.value}
                {roll.bonus && <span className="text-fluent-jonquil ml-1">(Bonus!)</span>}
                at {roll.time}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white text-sm">No rolls yet</p>
        )}
      </div>
    </div>
  )
}

export default function UpcomingSchedule({ schedule }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4">Upcoming Schedule</h2>
      <ul className="space-y-2">
        {schedule.map((event, i) => (
          <li key={i} className="border-l-4 border-[#FE9900] pl-4">
            <p className="font-medium text-[#1E1E1E]">{event.title}</p>
            <p className="text-gray-500 text-sm">{event.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

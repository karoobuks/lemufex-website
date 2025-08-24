export default function RecentActivity({ activities }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4">Recent Activity</h2>
      <ul className="space-y-2">
        {activities.map((activity, i) => (
          <li key={i} className="border-b pb-2 text-sm">
            <span className="text-[#1E1E1E] font-medium">{activity.description}</span>
            <span className="block text-gray-500">{activity.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

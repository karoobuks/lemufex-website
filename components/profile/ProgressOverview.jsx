export default function ProgressOverview({ progress }) {
  const percent = Math.round((progress.completed / progress.total) * 100);
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4">Progress</h2>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-[#FE9900] h-4 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <p>{progress.completed} / {progress.total} modules completed ({percent}%)</p>
    </div>
  );
}

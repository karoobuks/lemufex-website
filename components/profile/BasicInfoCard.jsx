export default function BasicInfoCard({ trainee }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4">Basic Information</h2>
      <div className="space-y-2">
        <p><strong>Email:</strong> {trainee.email}</p>
        <p><strong>Phone:</strong> {trainee.phone}</p>
        <p><strong>Date Joined:</strong> {trainee.joinDate}</p>
        <p><strong>Mentor:</strong> {trainee.mentor}</p>
      </div>
    </div>
  );
}

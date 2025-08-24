import ProfileHeader from './ProfileHeader';
import BasicInfoCard from './BasicInfoCard';
import ProgressOverview from './ProgressOverview';
import RecentActivity from './RecentActivity';
import UpcomingSchedule from './UpcomingSchedule';

export default function ProfilePage({ trainee, progress, activities, schedule }) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <ProfileHeader trainee={trainee} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BasicInfoCard trainee={trainee} />
        <ProgressOverview progress={progress} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity activities={activities} />
        <UpcomingSchedule schedule={schedule} />
      </div>
    </div>
  );
}

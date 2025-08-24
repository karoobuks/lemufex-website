import { FaInfoCircle } from "react-icons/fa";

export default function NoCoursesNotice() {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-[#ABD1C6] border border-[#004643] rounded-lg p-6 shadow-lg transition hover:shadow-xl">
      <FaInfoCircle className="text-[#E16162] text-4xl mb-3 animate-bounce" />
      <h3 className="text-xl font-bold text-[#001e1d] mb-2">
        Your training has not commenced yet
      </h3>
      <p className="text-[#001e1d] max-w-md text-sm md:text-base">
        No courses have been assigned to you at the moment. Please check back later once your training schedule is released.
      </p>
    </div>
  );
}

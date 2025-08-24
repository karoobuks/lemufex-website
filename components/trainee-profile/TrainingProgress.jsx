'use client';
import React from 'react';
import NoCoursesNotice from './NoCoursesNotice';

export default function TrainingProgress({ courses }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Your Training Courses</h2>
      {courses.length === 0 ? (
        <p className='text-gray-700'> <NoCoursesNotice/> </p>
      ) : (
        courses.map((course, index) => (
          <div key={index} className="mb-4">
            <p className="font-bold">{course.name}</p>
            <div className="h-4 bg-gray-900 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#FE9900] transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{course.progress}% Complete</p>
          </div>
        ))
      )}
    </div>
  );
}

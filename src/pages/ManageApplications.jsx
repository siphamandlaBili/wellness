import React from 'react';
import { manageJobsData } from '../assets/assets';
import moment from 'moment';

const ManageApplications = () => {
 
  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead className='bg-[#992787] text-white'>
            <tr>
              <th className='py-2 px-4 text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 text-left'>Event Type</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-center'>Attendies</th>
              <th className='py-2 px-4 text-left'>Accepted</th>
            </tr>
          </thead>
          <tbody>
            {manageJobsData.map((job, index) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{job.eventCode}</td>
                <td className='py-2 px-4 border-b'>{job.eventType}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.eventDate).format('ll')}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{job.eventLocation}</td>
                <td className='py-2 px-4 border-b text-center'>{job.numberOfAttendees}</td>
                <td className='py-2 px-4 border-b text-center'>
  <span
    className='cursor-pointer text-green-500 ml-4'
    onClick={() => handleAccept()}
  >
    ✔
  </span>
  <span
    className='cursor-pointer text-red-500 ml-4'
    onClick={() => handleDecline()}
  >
    ✘
  </span>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-end'>
      </div>
    </div>
  );
};

export default ManageApplications;

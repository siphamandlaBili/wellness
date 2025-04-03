import React,{useContext,useEffect,useState} from 'react';
import { manageJobsData } from '../assets/assets';
import moment from 'moment';
import { AuthContext } from '../../context/authContext';

const ManageApplications = () => {
 const {userEvents,setEventStorage,user} = useContext(AuthContext);

 console.log(user.clientEmail);
  const getEvent = async () => {
  const response = await fetch('http://localhost:5000/events');
  const data = await response.json();
  
  const ownedbyUser = data.filter((event) => event.clientEmail === user.clientEmail);
  await setEventStorage(ownedbyUser);
  console.log(userEvents);
  }
  useEffect(() => {
    getEvent();
  }, []);
  
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
              <th className='py-2 px-4 text-left'>status</th>
            </tr>
          </thead>
          <tbody>
            {userEvents.map((event, index) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event.eventCode}</td>
                <td className='py-2 px-4 border-b'>{event.eventType}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event.eventDate}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event.eventLocation}</td>
                <td className='py-2 px-4 border-b text-center'>{event.numberOfAttendees}</td>
                <td className='py-2 px-4 border-b text-center'>{event.status? event.status:"no status"}</td>

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

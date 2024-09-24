import React, { useState } from 'react'

import { useClockInMutation, useClockOutMutation, useGetListAttendanceQuery } from '@/services/attendace'

interface ClockInOutProps {
  staffId: string
}

const ClockInOut: React.FC<ClockInOutProps> = ({ staffId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'clockIn' | 'clockOut' | null>(null)
  const [currentTime, setCurrentTime] = useState<string | null>(null)

  // Panggil useGetListAttendanceQuery dengan staffId sebagai parameter
  const { data: attendanceData, isLoading: isLoadingAttendance } = useGetListAttendanceQuery(staffId)
  const [clockIn, { isLoading: isLoadingClockIn }] = useClockInMutation()
  const [clockOut, { isLoading: isLoadingClockOut }] = useClockOutMutation()

  const handleOpenModal = (type: 'clockIn' | 'clockOut') => {
    setActionType(type)
    setCurrentTime(new Date().toISOString()) // Simpan waktu saat ini
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setActionType(null)
    setCurrentTime(null)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        data: {
          attributes: { staffId },
        },
      }

      if (actionType === 'clockIn') {
        await clockIn(payload).unwrap()
      } else if (actionType === 'clockOut') {
        await clockOut(payload).unwrap()
      }
      handleCloseModal()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during clock in/out:', error)
    }
  }

  const hasClockedIn = attendanceData?.data.some((att: { attributes: { clockin: any } }) => att.attributes.clockin)
  const hasClockedOut = attendanceData?.data.some((att: { attributes: { clockout: any } }) => att.attributes.clockout)

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
    return new Date(dateString).toLocaleString(undefined, options)
  }

  return (
    <div className='mt-6 flex flex-col items-center'>
      {!hasClockedIn && (
        <button
          onClick={() => handleOpenModal('clockIn')}
          className='mb-4 rounded bg-green-500 px-4 py-2 text-white'
        >
          Clock In
        </button>
      )}
      {!hasClockedOut && (
        <button
          onClick={() => handleOpenModal('clockOut')}
          className='rounded bg-red-500 px-4 py-2 text-white'
        >
          Clock Out
        </button>
      )}

      {isModalOpen && (
        // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='rounded bg-white p-6 shadow-lg'>
            <h2 className='mb-4 text-lg font-bold'>
              {actionType === 'clockIn' ? 'Clock In Confirmation' : 'Clock Out Confirmation'}
            </h2>
            <p>Current Time: {currentTime && formatDate(currentTime)}</p>
            <p>Are you sure you want to {actionType === 'clockIn' ? 'clock in' : 'clock out'}?</p>
            <div className='mt-4'>
              <button
                onClick={handleSubmit}
                className={`mr-2 rounded px-4 py-2 text-white ${
                  actionType === 'clockIn' ? 'bg-blue-500' : 'bg-red-500'
                }`}
                disabled={isLoadingClockIn || isLoadingClockOut}
              >
                Yes
              </button>
              <button
                onClick={handleCloseModal}
                className='rounded bg-gray-500 px-4 py-2 text-white'
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='mt-6'>
        {isLoadingAttendance ? (
          <p>Loading attendance data...</p>
        ) : attendanceData && attendanceData.data.length > 0 ? (
          <ul>
            {attendanceData.data.map(
              (attendance: { id: React.Key | null | undefined; attributes: { clockin: string; clockout: string } }) => (
                <li key={attendance.id}>
                  <p>Clock In: {formatDate(attendance.attributes.clockin)}</p>
                  <p>Clock Out: {formatDate(attendance.attributes.clockout)}</p>
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No attendance data available.</p>
        )}
      </div>
    </div>
  )
}

export default ClockInOut

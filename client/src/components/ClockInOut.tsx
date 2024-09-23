import React, { useState } from 'react'

import { useClockInMutation, useClockOutMutation } from '@/services/attendace'

interface ClockInOutProps {
  staffId: string // Tambahkan prop untuk staffId
}

const ClockInOut: React.FC<ClockInOutProps> = ({ staffId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'clockIn' | 'clockOut' | null>(null)

  const [clockIn, { isLoading: isLoadingClockIn }] = useClockInMutation()
  const [clockOut, { isLoading: isLoadingClockOut }] = useClockOutMutation()

  const handleOpenModal = (type: 'clockIn' | 'clockOut') => {
    setActionType(type)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setActionType(null)
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
        await clockOut(payload).unwrap() // Menggunakan payload untuk clockOut
      }
      handleCloseModal()
    } catch (error) {
      console.error('Error during clock in/out:', error)
    }
  }

  return (
    <div className='mt-6 flex flex-col items-center'>
      <button
        onClick={() => handleOpenModal('clockIn')}
        className='mb-4 rounded bg-green-500 px-4 py-2 text-white'
      >
        Clock In
      </button>
      <button
        onClick={() => handleOpenModal('clockOut')}
        className='rounded bg-red-500 px-4 py-2 text-white'
      >
        Clock Out
      </button>

      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='rounded bg-white p-6 shadow-lg'>
            <h2 className='mb-4 text-lg font-bold'>
              {actionType === 'clockIn' ? 'Clock In Confirmation' : 'Clock Out Confirmation'}
            </h2>
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
    </div>
  )
}

export default ClockInOut

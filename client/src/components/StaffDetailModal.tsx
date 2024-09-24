import React from 'react'

interface StaffDetailModalProps {
  isOpen: boolean
  onClose: () => void
  staff: {
    id: string
    fullName: string
    email: string
    firstName: string
    lastName: string
    username: string
    staffId: string
  } | null
}

const StaffDetailModal: React.FC<StaffDetailModalProps> = ({ isOpen, onClose, staff }) => {
  if (!isOpen || !staff) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
        <h2 className='mb-4 text-2xl font-bold'>Detail Staf</h2>
        <p>
          <strong>Nama Lengkap:</strong> {staff.fullName}
        </p>
        <p>
          <strong>Email:</strong> {staff.email}
        </p>
        <p>
          <strong>Username:</strong> {staff.username}
        </p>
        <p>
          <strong>Staff ID:</strong> {staff.staffId}
        </p>
        <button
          onClick={onClose}
          className='mt-4 w-full rounded-md bg-red-500 py-2 px-4 text-white hover:bg-red-600'
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default StaffDetailModal

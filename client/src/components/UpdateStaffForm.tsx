import React, { useState } from 'react'
import { useUpdateStaffMutation } from '@/services/staffs'

interface UpdateStaffFormProps {
  staffId: string
  firstname: string
  lastname: string
  email: string
}

const UpdateStaffForm: React.FC<UpdateStaffFormProps> = ({ staffId, firstname, lastname, email }) => {
  // Inisialisasi state dengan nilai yang diterima dari props
  const [firstName, setFirstName] = useState<string>(firstname)
  const [lastName, setLastName] = useState<string>(lastname)
  const [staffEmail, setStaffEmail] = useState<string>(email)

  // State untuk kontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Hook untuk updateStaff mutation
  const [updateStaff, { isLoading, isSuccess, isError }] = useUpdateStaffMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Buat payload untuk request update staff
    const payload = {
      data: {
        attributes: {
          firstName,
          lastName,
          email: staffEmail,
        },
      },
    }

    try {
      // Ganti dengan format yang benar untuk memanggil mutation
      await updateStaff({ id: staffId, data: payload }).unwrap()
      alert('Staff updated successfully')
      setIsModalOpen(false) // Tutup modal setelah berhasil
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update staff', error)
    }
  }

  return (
    <>
      {/* Button to open the modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className='mt-4 rounded-md bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none'
      >
        Edit Staff
      </button>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
            <h2 className='mb-4 text-2xl font-bold'>Update Staff</h2>

            <form
              onSubmit={handleSubmit}
              className='space-y-4'
            >
              <div>
                <label className='block text-sm font-medium text-gray-700'>Firstname</label>
                <input
                  type='text'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Lastname</label>
                <input
                  type='text'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Email</label>
                <input
                  type='email'
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  required
                />
              </div>

              <button
                type='submit'
                className='w-full rounded-md bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none'
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Staff'}
              </button>

              {isError && <p className='mt-2 text-red-500'>Failed to update staff. Please try again.</p>}
              {isSuccess && <p className='mt-2 text-green-500'>Staff updated successfully!</p>}
            </form>

            {/* Button to close the modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className='mt-4 w-full rounded-md bg-red-500 py-2 px-4 text-white hover:bg-red-600'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateStaffForm

import { getCookie } from 'cookies-next'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ClockInOut from '@/components/ClockInOut'
import Language from '@/components/Language'
import Loading from '@/components/Loading'
import Logout from '@/components/Logout'
import StaffDetailModal from '@/components/StaffDetailModal'
import UpdateStaffForm from '@/components/UpdateStaffForm'
import { USER_ACCESS_TOKEN } from '@/config/token'
import Blank from '@/layouts/Blank'
import { useGetDetailStaffQuery, useGetListStaffsQuery } from '@/services/staffs'
import { formatDate } from '@/utils/formatdate'

// Definisikan tipe untuk struktur token yang didekode
interface DecodedToken {
  id: string
  type: string
  iat: number
  exp: number
}

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home'])
  const [currentTime, setCurrentTime] = useState<string>('')
  const [staffId, setStaffId] = useState<string | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<any>(null) // State untuk staff yang dipilih
  const [isModalOpen, setIsModalOpen] = useState(false) // State untuk kontrol modal

  // Mengambil daftar staf
  const { data: staffList, isLoading: isLoadingStaffList, isError: isErrorStaffList } = useGetListStaffsQuery({})

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(formatDate(now))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const token = getCookie(USER_ACCESS_TOKEN) as string | undefined

  useEffect(() => {
    if (token && typeof token === 'string') {
      const decodedToken = jwtDecode<DecodedToken>(token)
      setStaffId(decodedToken.id)
    }
  }, [token])

  // Ambil detail staf menggunakan staffId
  const {
    data: staffDetails,
    isLoading,
    isError,
  } = useGetDetailStaffQuery(staffId as string, {
    skip: !staffId,
  })

  if (isLoading || isLoadingStaffList) {
    return <Loading isRouteChanging={false} />
  }

  if (isError || isErrorStaffList) {
    return <div className='text-red-500'>Error fetching staff details.</div>
  }

  // Fungsi untuk membuka modal
  const handleStaffClick = (staff: any) => {
    setSelectedStaff(staff)
    setIsModalOpen(true)
  }

  return (
    <Blank title={t('home:title')}>
      <main className='min-h-screen bg-gray-100 py-8'>
        <section className='mx-auto max-w-screen-lg rounded-lg bg-white py-10 px-6 shadow-lg'>
          {/* Header */}
          <div className='flex flex-row items-center justify-between'>
            <h1 className='text-3xl font-bold text-gray-800'>{t('common:titles.home')}</h1>
            <Language />
          </div>

          {/* Current Time Display */}
          <div className='mt-6 rounded-lg border border-blue-300 bg-blue-100 p-4 shadow-md'>
            <p className='text-2xl font-bold text-blue-800'>{`Current Time: ${currentTime}`}</p>
          </div>

          {/* Clock In/Out Component */}
          {staffId && <ClockInOut staffId={staffId} />}

          {/* Staff Details Section */}
          {staffDetails?.data && staffDetails.data.length > 0 && (
            <div className='mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <h2 className='text-xl font-semibold text-gray-800'>Detail Staf</h2>
              <div className='mt-2'>
                <p>
                  <strong>Nama Lengkap:</strong> {staffDetails.data[0].attributes.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {staffDetails.data[0].attributes.email}
                </p>
              </div>

              {/* Button untuk membuka Update Modal */}
              <UpdateStaffForm
                staffId={staffDetails.data[0].attributes.id ?? ''}
                firstname={staffDetails.data[0].attributes.firstName ?? ''}
                lastname={staffDetails.data[0].attributes.lastName ?? ''}
                email={staffDetails.data[0].attributes.email ?? ''}
              />
            </div>
          )}

          {/* Staff List Section */}
          {staffList?.data && staffList.data.length > 0 && (
            <div className='mt-6'>
              <h2 className='text-xl font-semibold text-gray-800'>Daftar Staf</h2>
              <ul className='mt-4 space-y-2'>
                {staffList.data.map((staff: any) => (
                  <li
                    key={staff.id}
                    onClick={() => handleStaffClick(staff.attributes)}
                    className='cursor-pointer rounded-lg border border-gray-300 bg-gray-100 p-4 transition-shadow duration-200 hover:bg-gray-200 hover:shadow-lg'
                  >
                    <strong>{staff.attributes.fullName}</strong> - {staff.attributes.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Logout />
        </section>

        {/* Modal untuk menampilkan detail staf */}
        <StaffDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staff={selectedStaff}
        />
      </main>
    </Blank>
  )
}

export default Home

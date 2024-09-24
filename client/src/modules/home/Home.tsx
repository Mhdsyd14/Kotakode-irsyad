import { getCookie } from 'cookies-next'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ClockInOut from '@/components/ClockInOut'
import Language from '@/components/Language'
import Loading from '@/components/Loading'
import Logout from '@/components/Logout'
import { USER_ACCESS_TOKEN } from '@/config/token'
import Blank from '@/layouts/Blank'
import { useGetDetailStaffQuery } from '@/services/staffs'
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

  if (isLoading) {
    return <Loading isRouteChanging={false} />
  }

  if (isError) {
    return <div className='text-red-500'>Error fetching staff details.</div>
  }

  return (
    <Blank title={t('home:title')}>
      <main className='min-h-screen bg-gray-100 py-8'>
        <section className='mx-auto max-w-screen-lg rounded-lg bg-white py-10 px-6 shadow-lg'>
          <div className='flex flex-row items-center justify-between'>
            <h1 className='text-3xl font-bold text-gray-800'>{t('common:titles.home')}</h1>
            <Language />
          </div>

          <div className='mt-6 flex flex-col items-center'>
            {/* Tampilan Jam yang Diperbarui */}
            <div className='rounded-lg border border-blue-300 bg-blue-100 p-4 shadow-md'>
              <p className='text-2xl font-bold text-blue-800'>{`Current Time: ${currentTime}`}</p>
            </div>

            {staffId && <ClockInOut staffId={staffId} />}

            {/* Tampilkan detail staf */}
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
              </div>
            )}
          </div>
          <Logout />
        </section>
      </main>
    </Blank>
  )
}

export default Home

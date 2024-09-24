import { getCookie } from 'cookies-next'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ClockInOut from '@/components/ClockInOut'
import Language from '@/components/Language'
import Logout from '@/components/Logout'
import { USER_ACCESS_TOKEN } from '@/config/token'
import Blank from '@/layouts/Blank'
import { useGetDetailStaffQuery } from '@/services/staffs' // Import hook

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

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
    return date.toLocaleString(undefined, options)
  }

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
    skip: !staffId, // Lewati query jika staffId tidak ada
  })

  if (isLoading) {
    return <div>Loading...</div> // Tampilkan status loading
  }

  if (isError) {
    return <div>Error fetching staff details.</div> // Tampilkan status error
  }

  return (
    <Blank title={t('home:title')}>
      <main className='min-h-screen bg-gray-100'>
        <section className='mx-auto min-h-screen max-w-screen-sm bg-white py-10'>
          <div className='flex flex-row items-center justify-between px-6 text-center'>
            <h1 className='font-primary text-2xl font-bold md:text-4xl'>{t('common:titles.home')}</h1>
            <Language />
          </div>

          <div className='flex flex-col items-center'>
            <p className='mt-4 text-lg'>{`Current Time: ${currentTime}`}</p>
            {staffId && <ClockInOut staffId={staffId} />} {/* Kirim staffId ke ClockInOut */}
            {/* Tampilkan detail staf */}
            {staffDetails?.data && staffDetails.data.length > 0 && (
              <div className='mt-6'>
                {/* Ambil data staf dari array data */}
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

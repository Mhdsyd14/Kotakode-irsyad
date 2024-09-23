import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ClockInOut from '@/components/ClockInOut'
import Language from '@/components/Language'
import Logout from '@/components/Logout' // Import komponen Logout
import Blank from '@/layouts/Blank'

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home'])
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

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
            <ClockInOut /> {/* Render komponen ClockInOut */}
            <Logout /> {/* Render komponen Logout */}
          </div>
        </section>
      </main>
    </Blank>
  )
}

export default Home

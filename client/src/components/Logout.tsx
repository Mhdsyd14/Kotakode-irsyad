import { setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { USER_ACCESS_TOKEN } from '@/config/token'
import { usePostLogoutMutation } from '@/services/auth'
import { AuthRequest } from '@/types/auth'

const Logout: React.FC = () => {
  const router = useRouter()
  const [doLogout, { isSuccess }] = usePostLogoutMutation()

  const handleLogout = async () => {
    await doLogout({} as AuthRequest) // Memanggil mutation logout
  }

  useEffect(() => {
    if (isSuccess) {
      // Menghapus token setelah logout
      setCookie(USER_ACCESS_TOKEN, '', { maxAge: -1 }) // Menghapus cookie
      router.push('/login') // Redirect ke halaman login
    }
  }, [isSuccess])

  return (
    <button
      onClick={handleLogout}
      className='mt-6 ml-6 rounded bg-red-500 px-4 py-2 text-white'
    >
      Logout
    </button>
  )
}

export default Logout

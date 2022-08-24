import { Switch } from '@mui/material'
import axios from 'axios'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../../context'

export default function ModeControl() {
  const appContext = useContext(AppContext)

  const changeTheme = async () => {
    const newTheme = appContext.theme === 'light' ? 'dark' : 'light'
    appContext.setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await axios.put(
          '/user/theme',
          {
            theme: newTheme,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } catch (e) {
        toast.error(e.response.data.message)
      }
    }
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  const defaultCheck =
    appContext.theme === 'dark' || (appContext.theme === null && prefersDark)

  return (
    <Switch
      color='secondary'
      defaultChecked={defaultCheck}
      onChange={changeTheme}
    />
  )
}

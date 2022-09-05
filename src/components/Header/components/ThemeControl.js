import { LightMode, ModeNight } from '@mui/icons-material'
import { Switch } from '@mui/material'
import axios from 'axios'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../../../context'

export const ThemeControl = () => {
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
    <>
      {appContext.theme === 'dark' ? (
        <ModeNight sx={{ color: '#868686' }} />
      ) : (
        <LightMode sx={{ color: '#868686' }} />
      )}
      <Switch
        sx={{ mx: 2.5 }}
        color='secondary'
        defaultChecked={defaultCheck}
        onChange={changeTheme}
      />
    </>
  )
}

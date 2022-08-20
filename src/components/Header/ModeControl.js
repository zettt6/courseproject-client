import { DarkMode, LightMode } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'

export default function ModeControl() {
  const [mode, setMode] = useState('light')

  const changeMode = () => {
    if (mode === 'light') {
      setMode('dark')
    } else setMode('light')
  }
  return (
    <IconButton
      aria-label='account of current user'
      aria-controls='menu-appbar'
      aria-haspopup='true'
      onClick={changeMode}
      color='inherit'
    >
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  )
}

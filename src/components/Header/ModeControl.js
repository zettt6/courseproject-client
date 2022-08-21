import { Switch } from '@mui/material'
import React, { useContext } from 'react'
import { AppContext } from '../../context'

export default function ModeControl() {
  const appContext = useContext(AppContext)

  return (
    <Switch
      color='secondary'
      onChange={() =>
        appContext.setMode(appContext.mode === 'light' ? 'dark' : 'light')
      }
    />
  )
}

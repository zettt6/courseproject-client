import React, { useState } from 'react'
import { Select, MenuItem } from '@mui/material'

export default function LanguageControl() {
  const [language, setLanguage] = useState('EN')
  const [open, setOpen] = useState(false)

  const handleChange = (e) => {
    setLanguage(e.target.value)
  }

  const toggleLanguage = () => {
    setOpen(!open)
  }

  return (
    <Select
      sx={{
        m: 0.5,
        minWidth: '70px',
        color: '#c5c5c6',
      }}
      open={open}
      onClose={toggleLanguage}
      onOpen={toggleLanguage}
      value={language}
      onChange={handleChange}
    >
      <MenuItem value={'EN'}>EN</MenuItem>
      <MenuItem value={'RU'}>RU</MenuItem>
    </Select>
  )
}

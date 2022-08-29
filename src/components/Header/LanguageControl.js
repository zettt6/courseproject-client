import React, { useState } from 'react'
import { Select, MenuItem } from '@mui/material'

export default function LanguageControl() {
  const [language, setLanguage] = useState('en')
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
        minWidth: '50px',
        color: 'inherit',
      }}
      variant='standard'
      open={open}
      onClose={toggleLanguage}
      onOpen={toggleLanguage}
      value={language}
      onChange={handleChange}
    >
      <MenuItem value={'en'}>EN</MenuItem>
      <MenuItem value={'ru'}>RU</MenuItem>
    </Select>
  )
}

import React, { useEffect, useState } from 'react'
import { Select, MenuItem } from '@mui/material'

import i18next from 'i18next'
import cookies from 'js-cookie'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function LanguageControl() {
  const [open, setOpen] = useState(false)

  const currentLanguage = cookies.get('i18next') || 'en'

  // the choice is not saved
  useEffect(() => {
    changeLanguage()
  }, [currentLanguage])

  const handleChange = (e) => {
    i18next.changeLanguage(e.target.value)
  }

  const toggleLanguage = () => {
    setOpen(!open)
  }

  const changeLanguage = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await axios.put(
          '/user/language',
          {
            language: currentLanguage,
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

  return (
    <Select
      sx={{
        m: 1,
        minWidth: '50px',
        color: '#888888',
      }}
      variant='standard'
      open={open}
      onClose={toggleLanguage}
      onOpen={toggleLanguage}
      value={currentLanguage}
      onChange={handleChange}
    >
      <MenuItem value={'en'}>EN</MenuItem>
      <MenuItem value={'ru'}>RU</MenuItem>
    </Select>
  )
}

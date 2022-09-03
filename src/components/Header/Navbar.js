import React, { useContext, useState } from 'react'
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material'
import { Logout } from '@mui/icons-material'
import { SearchAppBar } from './SearchAppBar'
import { useNavigate } from 'react-router-dom'
import AuthPopup from './AuthPopup'
import LanguageControl from './LanguageControl'
import RegisterPopup from './RegisterPopup'
import { AppContext } from '../../context'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const [authPopupIsOpen, setAuthPopupIsOpen] = useState(false)
  const [registerPopupIsOpen, setRegisterPopupIsOpen] = useState(false)
  const appContext = useContext(AppContext)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const toggleAuthPopup = () => {
    setAuthPopupIsOpen(!authPopupIsOpen)
  }

  const toggleRegisterPopup = () => {
    setRegisterPopupIsOpen(!registerPopupIsOpen)
  }

  const logout = () => {
    localStorage.removeItem('token')
    appContext.setUserData(null)
  }

  return (
    <AppBar position='sticky'>
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box
          sx={{
            display: {
              xs: 'none',
              sm: 'block',
            },
          }}
        >
          <SearchAppBar />
        </Box>
        <LanguageControl />
        {appContext.userData ? (
          <IconButton sx={{ ml: 2 }} onClick={logout}>
            <Logout sx={{ color: appContext.theme === 'dark' && '#696969' }} />
          </IconButton>
        ) : (
          <Box>
            <Button onClick={toggleRegisterPopup} color='inherit'>
              {t('sign_up')}
            </Button>
            <Button
              onClick={toggleAuthPopup}
              variant='outlined'
              sx={{ borderRadius: '20px', marginLeft: 1 }}
              color='inherit'
            >
              {t('sign_in')}
            </Button>
          </Box>
        )}
        <AuthPopup
          authPopupIsOpen={authPopupIsOpen}
          toggleAuthPopup={toggleAuthPopup}
        />
        <RegisterPopup
          registerPopupIsOpen={registerPopupIsOpen}
          toggleRegisterPopup={toggleRegisterPopup}
        />
      </Toolbar>
    </AppBar>
  )
}

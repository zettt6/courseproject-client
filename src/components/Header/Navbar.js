import React, { useContext, useState } from 'react'
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material'
import { AccountCircle, GroupOutlined, Home, Logout } from '@mui/icons-material'
import { SearchAppBar } from './SearchAppBar'
import { useNavigate } from 'react-router-dom'
import AuthPopup from './AuthPopup'
import LanguageControl from './LanguageControl'
import ThemeControl from './ThemeControl'
import RegisterPopup from './RegisterPopup'
import { AppContext } from '../../context'

export default function Navbar() {
  const [authPopupIsOpen, setAuthPopupIsOpen] = useState(false)
  const [registerPopupIsOpen, setRegisterPopupIsOpen] = useState(false)
  const appContext = useContext(AppContext)

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
            <Logout />
          </IconButton>
        ) : (
          <Box>
            <Button onClick={toggleRegisterPopup} color='inherit'>
              Sign up
            </Button>
            <Button
              onClick={toggleAuthPopup}
              variant='outlined'
              sx={{ borderRadius: '20px', marginLeft: 1 }}
              color='inherit'
            >
              Sign in
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

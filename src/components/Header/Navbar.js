import React, { useContext, useState } from 'react'
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material'
import { AccountCircle, Logout, Settings } from '@mui/icons-material'
import { SearchAppBar } from './SearchAppBar'
import { useNavigate } from 'react-router-dom'
import AuthPopup from './AuthPopup'
import LanguageControl from './LanguageControl'
import ModeControl from './ModeControl'
import RegisterPopup from './RegisterPopup'
import { AppContext } from '../../context'

export default function Navbar() {
  const [authPopupIsOpen, setAuthPopupIsOpen] = useState(false)
  const [registerPopupIsOpen, setRegisterPopupIsOpen] = useState(false)
  const appContext = useContext(AppContext)

  const navigate = useNavigate()

  const goToProfilePage = () => {
    navigate('/profile')
  }

  const goToMainPage = () => {
    navigate('/')
  }

  const goToUsersPage = () => {
    navigate('/users')
  }

  const logout = () => {
    localStorage.removeItem('token')
    appContext.setUserData(null)
  }

  const toggleAuthPopup = () => {
    setAuthPopupIsOpen(!authPopupIsOpen)
  }

  const toggleRegisterPopup = () => {
    setRegisterPopupIsOpen(!registerPopupIsOpen)
  }

  return (
    <AppBar position='static'>
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color='inherit'
          onClick={goToMainPage}
          sx={{ width: '140px', borderRadius: '20px' }}
        >
          collections
        </Button>
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
        <ModeControl />

        {appContext.userData ? (
          <Box>
            <IconButton
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={goToProfilePage}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>

            {appContext.userData.role === 'ADMIN' && (
              <IconButton
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={goToUsersPage}
                color='inherit'
              >
                <Settings />
              </IconButton>
            )}

            <IconButton
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={logout}
              color='inherit'
            >
              <Logout />
            </IconButton>
          </Box>
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

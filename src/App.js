import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './outlets/ProtectedRoute'
import { AppContext } from './context'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Header } from './components/Header'
import { Collection } from './components/Collection'
import { Main } from './components/Main'
import { Profile } from './components/Profile'
import { Users } from './components/Users'
import { Item } from './components/Item'
import { Sidebar } from './components/Sidebar'
import i18next from 'i18next'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

export const App = () => {
  const [userData, setUserData] = useState(null)
  const [theme, setTheme] = useState('light')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    checkAuth()
    if (localStorage.getItem('theme')) {
      setTheme(localStorage.getItem('theme'))
    }
  }, [])

  useEffect(() => {
    if (userData && userData.selectedLanguage) {
      i18next.changeLanguage(userData.selectedLanguage)
    }
  }, [userData])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await axios.get('/user/checkauth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUserData(response.data)
      }
    } catch (e) {
      localStorage.removeItem('token')
      toast.error(e.response.data.message)
    } finally {
      setInitialized(true)
    }
  }

  const darkTheme = createTheme({
    palette: {
      type: 'dark',
      background: {
        default: '#1a1a1a',
      },
      primary: {
        main: '#202020',
        contrastText: '#4c4c4c',
      },
      secondary: {
        main: '#fff',
      },
    },
  })

  const lightTheme = createTheme({
    palette: {
      type: 'light',
      background: {
        default: '#e5e5e5',
      },
      primary: {
        main: '#d3d3d3',
        contrastText: '#888888',
      },
    },
  })

  return !initialized ? (
    ''
  ) : (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        theme,
        setTheme,
      }}
    >
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <Toaster
          position='bottom-right'
          containerStyle={{ fontFamily: 'Lato' }}
        />
        <BrowserRouter>
          <CssBaseline />
          <Header />
          <Sidebar />
          <Routes>
            <Route exact path='/' element={<Main />} />
            <Route exact path='/collections/:id' element={<Collection />} />
            <Route
              exact
              path='/collections/:id/items/:itemId'
              element={<Item />}
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute isAllowed={!!userData} redirectPath='/'>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/users'
              element={
                <ProtectedRoute
                  isAllowed={!!userData && userData.role === 'ADMIN'}
                  redirectPath='/'
                >
                  <Users />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AppContext.Provider>
  )
}

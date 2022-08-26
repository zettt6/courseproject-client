import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './outlets/ProtectedRoute'
import { AppContext } from './context'
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material'

import toast, { Toaster } from 'react-hot-toast'
import Navbar from './components/Header/Navbar'
import Collection from './pages/Collection'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Users from './pages/Users'
import axios from 'axios'
import Item from './pages/Item'

function App() {
  const [userData, setUserData] = useState(null)
  const [theme, setTheme] = useState('light')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    checkAuth()
    if (localStorage.getItem('theme')) {
      setTheme(localStorage.getItem('theme'))
    }
  }, [])

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
        contrastText: '#c5c5c6',
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
        contrastText: '#666666',
      },
    },
  })

  if (!initialized) return ''

  return (
    <Box sx={{ m: 0, p: 0 }}>
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
            <Navbar />
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
    </Box>
  )
}

export default App

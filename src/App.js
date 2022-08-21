import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import toast, { Toaster } from 'react-hot-toast'
import { AppContext } from './context'
import Collection from './pages/Collection'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Navbar from './components/Header/Navbar'
import { ProtectedRoute } from './outlets/ProtectedRoute'
import './App.css'
import axios from 'axios'
import { CssBaseline, Switch } from '@mui/material'

function App() {
  const [userData, setUserData] = useState(null)
  const [collections, setCollections] = useState([])
  const [mode, setMode] = useState('light')

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

  const selectedTheme = mode === 'dark' ? darkTheme : lightTheme

  useEffect(() => {
    checkAuth()
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
    } catch (err) {
      localStorage.removeItem('token')
      toast.error(err.response.data.message)
    }
  }

  return (
    <div className='App'>
      <AppContext.Provider
        value={{
          userData,
          setUserData,
          collections,
          setCollections,
          mode,
          setMode,
        }}
      >
        <ThemeProvider theme={selectedTheme}>
          <Toaster
            position='bottom-right'
            containerStyle={{ fontFamily: 'Lato' }}
          />
          <BrowserRouter>
            <CssBaseline />
            <Navbar />
            <Routes>
              <Route exact path='/' element={<Main />} />
              <Route
                exact
                path='/profile'
                element={
                  <ProtectedRoute isAllowed={!!userData} redirectPath='/'>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route exact path='/collection' element={<Collection />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AppContext.Provider>
    </div>
  )
}

export default App

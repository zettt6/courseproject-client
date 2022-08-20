import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Toaster } from 'react-hot-toast'
import { AppContext } from './context'
import Collection from './pages/Collection'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Navbar from './components/Header/Navbar'
import { ProtectedRoute } from './outlets/ProtectedRoute'
import './App.css'

function App() {
  const [userData, setUserData] = useState(null)
  const [collections, setCollections] = useState([])

  const theme = createTheme({
    palette: {
      primary: {
        main: '#202020',
        contrastText: '#c5c5c6',
      },
      secondary: {
        main: '#c5c5c6',
      },
      text: {
        primary: '#1a1a1a',
        secondary: '#c5c5c6',
      },
    },
    typography: {
      fontFamily: ['Lato', 'sans-serif'].join(','),
    },
  })

  useEffect(() => {
    // запрос на проверку авторизации при перезагрузке стр
  }, [])

  return (
    <div className='App'>
      <AppContext.Provider
        value={{
          userData,
          setUserData,
          collections,
          setCollections,
        }}
      >
        <ThemeProvider theme={theme}>
          <Toaster
            position='bottom-right'
            containerStyle={{ fontFamily: 'Lato' }}
          />
          <BrowserRouter>
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

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Register from './pages/Register'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: ['Lato', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#af52bf',
      contrastText: '#fff',
    },
    secondary: {
      main: '#af52bf',
    },
  },
})
function App() {
  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/main' element={<Main />} />
            <Route exact path='/profile' element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App

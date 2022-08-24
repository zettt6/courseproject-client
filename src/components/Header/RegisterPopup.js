import React, { useContext } from 'react'
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'

import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { emailRegex } from '../../utils/validation'
import axios from 'axios'
import { AppContext } from '../../context'

export default function RegisterPopup({
  registerPopupIsOpen,
  toggleRegisterPopup,
}) {
  const appContext = useContext(AppContext)

  const onSubmit = async (values) => {
    try {
      const response = await axios.post('/user/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      })
      localStorage.setItem('token', response.data.token)
      appContext.setUserData(response.data.user)
      toggleRegisterPopup()
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required().matches(emailRegex, 'Invalid email'),
      username: Yup.string().required(),
      password: Yup.string().required(),
    }),
    onSubmit,
  })

  return (
    <Dialog
      open={registerPopupIsOpen}
      onClose={toggleRegisterPopup}
      sx={{
        width: '520px',
        height: '450px',
        margin: '0 auto',
        padding: 3,
        borderRadius: '15px',
      }}
    >
      <DialogTitle>Sign up</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ my: 1 }}
          name='username'
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label='Username'
          placeholder='Enter username'
          fullWidth
          required
          error={!!formik.errors.username && !!formik.touched.username}
          helperText={!!formik.touched.username && formik.errors.username}
        />
        <TextField
          sx={{ my: 1 }}
          name='email'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label='Email'
          placeholder='Enter email'
          type='email'
          fullWidth
          required
          error={!!formik.errors.email && !!formik.touched.email}
          helperText={!!formik.touched.email && formik.errors.email}
        />
        <TextField
          sx={{ my: 1 }}
          name='password'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label='Password'
          placeholder='Enter password'
          type='password'
          fullWidth
          required
          error={!!formik.errors.password && !!formik.touched.password}
          helperText={!!formik.touched.password && formik.errors.password}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={formik.handleSubmit}
          color='primary'
          variant='contained'
          sx={{
            m: 2,
          }}
        >
          Sign up
        </Button>
      </DialogActions>
    </Dialog>
  )
}

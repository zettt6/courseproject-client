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

export default function AuthPopup({ authPopupIsOpen, toggleAuthPopup }) {
  const appContext = useContext(AppContext)

  const loginUser = async (values) => {
    try {
      const response = await axios.post(`/user/login`, {
        email: values.email,
        password: values.password,
      })
      localStorage.setItem('token', response.data.token)
      appContext.setUserData(response.data.user)
      toggleAuthPopup()
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required().matches(emailRegex, 'Invalid email'),
      password: Yup.string().required(),
    }),
    onSubmit: loginUser,
  })

  return (
    <Dialog
      open={authPopupIsOpen}
      onClose={toggleAuthPopup}
      sx={{
        width: '520px',
        height: '450px',
        margin: '0 auto',
        padding: 3,
        borderRadius: '15px',
      }}
    >
      <DialogTitle>Sign In</DialogTitle>
      <DialogContent>
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
          Sign in
        </Button>
      </DialogActions>
    </Dialog>
  )
}

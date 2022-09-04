import React, { useContext } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'

import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { emailRegex } from '../../../utils/validation'
import axios from 'axios'
import { AppContext } from '../../../context'
import RegisterForm from './RegisterForm'
import capitalize from '../../../utils/capitalize'
import { useTranslation } from 'react-i18next'

export default function RegisterPopup({
  registerPopupIsOpen,
  toggleRegisterPopup,
}) {
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

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
        height: '500px',
        margin: '0 auto',
        padding: 3,
        borderRadius: '15px',
      }}
    >
      <DialogTitle>{capitalize(`${t('sign_up')}`)}</DialogTitle>
      <DialogContent>
        <RegisterForm formik={formik} />
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

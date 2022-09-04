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
import capitalize from '../../../utils/capitalize'
import { useTranslation } from 'react-i18next'
import AuthForm from './AuthForm'

export default function AuthPopup({ authPopupIsOpen, toggleAuthPopup }) {
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(`/user/login`, {
        email: values.email,
        password: values.password,
      })
      localStorage.setItem('token', response.data.token)
      appContext.setUserData(response.data.user)
      toggleAuthPopup()
    } catch (e) {
      toast.error(e.response.data.message)
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
    onSubmit,
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
      <DialogTitle>{capitalize(`${t('sign_in')}`)}</DialogTitle>
      <DialogContent>
        <AuthForm formik={formik} />
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
          {capitalize(`${t('sign_in')}`)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

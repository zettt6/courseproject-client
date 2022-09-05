import { TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const RegisterForm = ({ formik }) => {
  const { t } = useTranslation()

  return (
    <>
      <TextField
        sx={{ my: 1 }}
        name='username'
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={`${t('username')}`}
        fullWidth
        error={!!formik.errors.username && !!formik.touched.username}
        helperText={!!formik.touched.username && formik.errors.username}
      />
      <TextField
        sx={{ my: 1 }}
        name='email'
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={`${t('email')}`}
        type='email'
        fullWidth
        error={!!formik.errors.email && !!formik.touched.email}
        helperText={!!formik.touched.email && formik.errors.email}
      />
      <TextField
        sx={{ my: 1 }}
        name='password'
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={`${t('password')}`}
        type='password'
        fullWidth
        error={!!formik.errors.password && !!formik.touched.password}
        helperText={!!formik.touched.password && formik.errors.password}
      />
    </>
  )
}

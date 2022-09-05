import { FileDownload } from '@mui/icons-material'
import { Button, styled } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../context'

export const UploadImage = ({ formik, setSelectedImage }) => {
  const { t } = useTranslation()
  const appContext = useContext(AppContext)

  const handleInput = (e) => {
    formik.setFieldValue('image', e.target.files[0])
    setSelectedImage(URL.createObjectURL(e.target.files[0]))
  }

  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
    color: appContext.theme === 'light' ? '#4c4c4c' : '#bdbbbb',
    '&:hover': {
      backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#868686',
    },
  }))

  return (
    <StyledButton
      variant='contained'
      sx={{ m: 1 }}
      endIcon={<FileDownload />}
      component='label'
    >
      <input hidden accept='image/*' type='file' onChange={handleInput} />
      {t('upload_image')}
    </StyledButton>
  )
}

import { FileDownload } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

export default function UploadImage({ formik }) {
  const handleInput = (e) => {
    formik.setFieldValue('image', e.target.files[0])
  }

  return (
    <Button
      variant='contained'
      sx={{ m: 1 }}
      endIcon={<FileDownload />}
      component='label'
    >
      <input hidden accept='image/*' type='file' onChange={handleInput} />
      upload image
    </Button>
  )
}

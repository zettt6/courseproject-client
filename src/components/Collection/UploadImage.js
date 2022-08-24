import React, { useState } from 'react'
import { Button, IconButton, Stack } from '@mui/material'
import { FileDownload } from '@mui/icons-material'
import { Image } from 'cloudinary-react'

export default function UploadImage() {
  const [image, setImage] = useState('')
  const [url, setUrl] = useState('')

  const uploadImage = () => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'courseproject')
    data.append('cloud_name', 'dlhxpkqbh')

    fetch('https://api.cloudinary.com/v1_1/dlhxpkqbh/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.secure_url)
      })
      .catch((e) => console.log(e))
  }

  const handleInput = (e) => {
    setImage(e.target.files[0])
  }

  return (
    <Stack direction='row' alignItems='center' spacing={1}>
      <IconButton aria-label='upload picture' component='label'>
        <input hidden accept='image/*' type='file' onChange={handleInput} />
        <FileDownload />
      </IconButton>
      <Button variant='contained' component='label' onClick={uploadImage}>
        Upload
      </Button>
      <Image cloudName='dlhxpkqbh' publicId={url} />
    </Stack>
  )
}

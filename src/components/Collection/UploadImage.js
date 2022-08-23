import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import toast from 'react-hot-toast'
import { FileDownload } from '@mui/icons-material'
import { Image } from 'cloudinary-react'

export default function UploadImage() {
  const [image, setImage] = useState('')
  const [url, setUrl] = useState('')

  // useEffect(() => {
  //   getImgs()
  // }, [])

  const uploadImage = async () => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'courseproject')
    data.append('cloud_name', 'dlhxpkqbh')

    fetch(' https://api.cloudinary.com/v1_1/dlhxpkqbh/image/upload', {
      method: 'post',
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUrl(data.secure_url)
      })
      .catch((err) => console.log(err))
  }

  // try {
  //   const response = await fetch(
  //     'https://api.cloudinary.com/v1_1/dlhxpkqbh/image/upload',
  //     {
  //       data,
  //     }
  //   )
  //   console.log(response.data.secure_url)
  //  // setUrl(response.data.url)
  // } catch (err) {
  //   toast.error(err.response.data.message)
  // }
  // }

  return (
    <Stack direction='row' alignItems='center' spacing={1}>
      <IconButton aria-label='upload picture' component='label'>
        <input
          hidden
          accept='image/*'
          type='file'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <FileDownload />
      </IconButton>
      <Button variant='contained' component='label' onClick={uploadImage}>
        Upload
      </Button>
      <Image cloudName='dlhxpkqbh' publicId={url} />
    </Stack>
  )
}

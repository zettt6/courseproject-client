import { FileDownload } from '@mui/icons-material'
import {
  Button,
  FormControl,
  IconButton,
  Stack,
  TextField,
} from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { AppContext } from '../../context'
import ReactLoading from 'react-loading'

export default function CollectionForm() {
  const [loading, setLoading] = useState(false)
  const appContext = useContext(AppContext)

  const createCollection = async (values, imageUrl) => {
    const token = localStorage.getItem('token')

    try {
      return axios.post(
        '/collections',
        {
          title: values.title,
          description: values.description,
          subject: values.subject,
          creatorId: appContext.userData._id,
          image: imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const uploadImage = async () => {
    const reqUrl = 'https://api.cloudinary.com/v1_1/dlhxpkqbh/image/upload'
    const data = new FormData()
    data.append('file', formik.values.image)
    data.append('upload_preset', 'courseproject')
    data.append('cloud_name', 'dlhxpkqbh')

    try {
      return fetch(reqUrl, {
        method: 'post',
        body: data,
      }).then((res) => res.json())
    } catch (e) {
      toast.error(e)
    }
  }

  const onSubmit = async (values) => {
    setLoading(true)
    let uploadedImage
    if (values.image) uploadedImage = await uploadImage()
    createCollection(values, uploadedImage?.secure_url)
    setLoading(false)
  }

  const handleInput = (e) => {
    formik.setFieldValue('image', e.target.files[0])
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      subject: '',
      image: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      description: Yup.string().required(),
      subject: Yup.string().required(),
    }),
    onSubmit,
  })

  return (
    <FormControl sx={{ m: 3, width: '400px' }}>
      <Stack spacing={1}>
        <TextField
          name='title'
          label='Title'
          placeholder='Enter title'
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.title && !!formik.touched.title}
          helperText={!!formik.touched.title && formik.errors.title}
        />
        <TextField
          name='description'
          label='Description'
          placeholder='Enter description'
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.description && !!formik.touched.description}
          helperText={!!formik.touched.description && formik.errors.description}
        />
        <TextField
          name='subject'
          label='Subject'
          placeholder='Enter subject'
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.subject && !!formik.touched.subject}
          helperText={!!formik.touched.subject && formik.errors.subject}
        />
        <Stack direction='row' alignItems='center' spacing={1}>
          <IconButton
            sx={{ width: '140px', borderRadius: '20px', fontSize: '16px' }}
            aria-label='upload img'
            component='label'
          >
            <input hidden accept='image/*' type='file' onChange={handleInput} />
            add image
            <FileDownload />
          </IconButton>
          {loading && (
            <ReactLoading
              type='spin'
              color='#7dd7ffde'
              height={20}
              width={20}
            />
          )}
        </Stack>
        <Button
          color='inherit'
          variant='outlined'
          sx={{ width: '200px' }}
          onClick={formik.handleSubmit}
        >
          create collection
        </Button>
      </Stack>
    </FormControl>
  )
}

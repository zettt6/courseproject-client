import React, { useContext, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { FileDownload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { AppContext } from '../../context'

export default function CollectionFormPopup({
  collectionFormPopupIsOpen,
  toggleCollectionFormPopup,
  getCollections,
}) {
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
    await getCollections()
    setLoading(false)
    toggleCollectionFormPopup()
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
    <Dialog
      open={collectionFormPopupIsOpen}
      onClose={toggleCollectionFormPopup}
      sx={{
        margin: '0 auto',
        padding: 3,
        borderRadius: '15px',
      }}
    >
      <DialogTitle>Create new collection</DialogTitle>
      <DialogContent>
        <TextField
          name='title'
          label='Title'
          placeholder='Enter title'
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.title && !!formik.touched.title}
          helperText={!!formik.touched.title && formik.errors.title}
          sx={{ my: 2 }}
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
          sx={{ my: 2 }}
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
          sx={{ my: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='inherit'
          sx={{ m: 1 }}
          endIcon={<FileDownload />}
          component='label'
        >
          <input hidden accept='image/*' type='file' onChange={handleInput} />
          upload image
        </Button>
        <LoadingButton
          loading={loading}
          color='inherit'
          variant='contained'
          sx={{ width: '200px' }}
          onClick={formik.handleSubmit}
        >
          create collection
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

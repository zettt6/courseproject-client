import { Button, FormControl, Stack, TextField } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { AppContext } from '../../context'
import UploadImage from './UploadImage'

export default function CollectionForm() {
  const appContext = useContext(AppContext)

  const createCollection = async (values) => {
    try {
      const response = await axios.post('/collections', {
        title: values.title,
        description: values.description,
        subject: values.subject,
        creatorId: appContext.userData._id,
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const deleteCollections = async () => {
    // console.log(selectedCollections)
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      subject: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      description: Yup.string().required(),
      subject: Yup.string().required(),
    }),
    onSubmit: createCollection,
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
        />
        <TextField
          name='description'
          label='Description'
          placeholder='Enter description'
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        <TextField
          name='subject'
          label='Subject'
          placeholder='Enter subject'
          value={formik.values.subject}
          onChange={formik.handleChange}
        />
        <Button
          color='inherit'
          variant='outlined'
          sx={{ width: '200px' }}
          onClick={formik.handleSubmit}
        >
          Create collection
        </Button>
        {/* <Button color='inherit' onClick={deleteCollections}>
          Delete collections
        </Button> */}
        <UploadImage />
      </Stack>
    </FormControl>
  )
}

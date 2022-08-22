import { Button, FormControl, TextField } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import React from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import InputTag from './InputTag'

export default function CollectionForm() {
  const createCollection = async (values) => {
    try {
      const response = await axios.post('/collection', {
        title: values.title,
        description: values.description,
        subject: values.subject,
      })
    } catch (err) {
      toast.error(err.response.data.message)
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
    <FormControl sx={{ m: 3 }}>
      <TextField
        name='title'
        label='Title'
        placeholder='Enter title'
        value={formik.values.title}
        onChange={formik.handleChange}
        sx={{ my: 0.5, width: '200px' }}
      />
      <TextField
        name='description'
        label='Description'
        placeholder='Enter description'
        value={formik.values.description}
        onChange={formik.handleChange}
        sx={{ my: 0.5, width: '200px' }}
      />
      <TextField
        name='subject'
        label='Subject'
        placeholder='Enter subject'
        value={formik.values.subject}
        onChange={formik.handleChange}
        sx={{ my: 0.5, width: '200px' }}
      />
      <InputTag />
      <Button color='inherit' onClick={formik.handleSubmit}>
        Create collection
      </Button>
      <Button color='inherit' onClick={deleteCollections}>
        Delete collections
      </Button>
    </FormControl>
  )
}

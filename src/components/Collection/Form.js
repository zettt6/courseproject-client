import { Button, FormControl, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

export default function CollectionForm({
  createCollection,
  deleteCollections,
}) {
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
      <Button onClick={formik.handleSubmit}>Create collection</Button>
      <Button onClick={deleteCollections}>Delete collections</Button>
    </FormControl>
  )
}

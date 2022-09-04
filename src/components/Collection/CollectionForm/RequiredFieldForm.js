import { Autocomplete, Box, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export default function RequiredFields({ formik }) {
  const [topics, setTopics] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    getTopics()
  }, [])

  const getTopics = async () => {
    try {
      const response = await axios.get(`/collections/topics`)
      setTopics(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  return (
    <Box display={'flex'} justifyContent={'space-between'}>
      <TextField
        name='title'
        placeholder={`${t('title')}`}
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.title && !!formik.touched.title}
        helperText={!!formik.touched.title && formik.errors.title}
      />
      <Autocomplete
        name='topic'
        disablePortal
        autoHighlight
        sx={{ width: '200px', mx: 1 }}
        options={topics}
        getOptionLabel={(option) => {
          return option.name
        }}
        onChange={(e, value) => formik.setFieldValue('topic', value.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`${t('topic')}`}
            onChange={formik.handleChange}
            value={formik.values.topic}
          />
        )}
      />
      <TextField
        multiline
        rows={2}
        name='description'
        placeholder={`${t('description')}`}
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.description && !!formik.touched.description}
        helperText={!!formik.touched.description && formik.errors.description}
      />
    </Box>
  )
}

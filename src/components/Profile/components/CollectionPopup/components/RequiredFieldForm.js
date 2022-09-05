import { Autocomplete, Box, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export const RequiredFieldForm = ({ formik }) => {
  const { t } = useTranslation()

  const [topics, setTopics] = useState([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    getTopics()
  }, [])

  const getTopics = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`/collections/topics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
        disablePortal
        autoHighlight
        sx={{ mx: 2, width: '200px' }}
        options={topics}
        onChange={(e, value) => formik.setFieldValue('topic', value)}
        value={formik.values.topic}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value)}
        renderInput={(params) => (
          <TextField placeholder={`${t('topic')}`} fullWidth {...params} />
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

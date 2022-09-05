import { Add, Delete } from '@mui/icons-material'
import { Autocomplete, Box, IconButton, TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../../../../../context'
import { EditCollectionSelect } from './EditCollectionSelect'

export const EditCollectionForm = ({
  setAdditionalFields,
  additionalFields,
  formik,
  selectedField,
  setSelectedField,
  addFields,
}) => {
  const [topics, setTopics] = useState([])
  const [inputValue, setInputValue] = useState('')
  const { t } = useTranslation()
  const appContext = useContext(AppContext)

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

  const handleChangeField = (e, index, key, isCheckbox) => {
    let temp = [...additionalFields]
    temp[index] = {
      ...temp[index],
      [key]: e.target.value,
    }
    setAdditionalFields(temp)
  }

  const removeFields = (index) => {
    let temp = [...additionalFields]
    temp.splice(index, 1)
    setAdditionalFields(temp)
  }

  return (
    <Box
      sx={{
        width: '200px',
        color: appContext.theme === 'light' ? '#4c4c4c' : '#868686',
      }}
    >
      <TextField
        name='title'
        placeholder={`${t('title')}`}
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.title && !!formik.touched.title}
        helperText={!!formik.touched.title && formik.errors.title}
        fullWidth
      />
      <Autocomplete
        disablePortal
        autoHighlight
        sx={{ my: 2 }}
        options={topics}
        onChange={(e, value) => formik.setFieldValue('topic', value)}
        value={formik.values.topic}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value)}
        placeholder={`${t('topic')}`}
        renderInput={(params) => <TextField fullWidth {...params} />}
      />
      <TextField
        sx={{ mb: 2 }}
        multiline
        rows={2}
        name='description'
        placeholder={`${t('description')}`}
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.description && !!formik.touched.description}
        helperText={!!formik.touched.description && formik.errors.description}
        fullWidth
      />

      <Box display={'flex'} alignItems={'center'}>
        <EditCollectionSelect
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          additionalFields={additionalFields}
        />

        {selectedField && (
          <IconButton onClick={addFields}>
            <Add />
          </IconButton>
        )}
      </Box>

      {additionalFields.map((field, index) => (
        <Box key={index}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              my: 1.5,
            }}
          >
            <TextField
              name={field.name}
              value={field.name}
              placeholder={`name for ${t(`${field.type}`)} field`}
              onChange={(e) => handleChangeField(e, index, 'name')}
            />
            <IconButton onClick={() => removeFields(index)}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

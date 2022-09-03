import { Box, Checkbox, TextField } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function AdditionalFieldForm({ formik, collection }) {
  const { t } = useTranslation()

  return (
    <Box>
      {collection.additionalFields.map((field, index) => (
        <Box key={index} display={'flex'} my={1}>
          {field.type === 'checkbox' ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                my: 1,
              }}
            >
              <Box>{field.name}</Box>
              <Checkbox
                name={field.name}
                checked={formik.values.name}
                onChange={formik.handleChange}
                sx={{ mx: 2 }}
              />
            </Box>
          ) : field.type === 'textarea' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
              <Box>{field.name}</Box>
              <TextField
                name={field.name}
                multiline
                rows={2}
                placeholder={`${t('text')}`}
                value={formik.values.name}
                onChange={formik.handleChange}
                sx={{ mx: 2 }}
              />
            </Box>
          ) : field.type === 'number' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
              <Box>{field.name}</Box>
              <TextField
                name={field.name}
                type={field.type}
                placeholder='0'
                value={formik.values.name}
                onChange={formik.handleChange}
                sx={{ mx: 2 }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
              <Box>{field.name}</Box>
              <TextField
                name={field.name}
                type={field.type}
                value={formik.values.name}
                placeholder={`${t(`${field.type}`)}`}
                onChange={formik.handleChange}
                sx={{ mx: 2 }}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

import { Delete } from '@mui/icons-material'
import { Box, Checkbox, IconButton, TextField } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function AdditionalFieldsForm({
  additionalFields,
  setAdditionalFields,
}) {
  const { t } = useTranslation()

  const handleChangeField = (e, index, key, isCheckbox) => {
    // true/false in value when isCheckbox
    let temp = [...additionalFields]
    temp[index] = {
      ...temp[index],
      [key]: isCheckbox ? e.target.checked : e.target.value,
    }
    setAdditionalFields(temp)
  }

  const removeFields = (index) => {
    let temp = [...additionalFields]
    temp.splice(index, 1)
    setAdditionalFields(temp)
  }

  return (
    <Box>
      {additionalFields.map((field, index) => (
        <Box key={index} display={'flex'} mx={1}>
          {field.type === 'checkbox' ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                my: 1,
              }}
            >
              <TextField
                name='name'
                placeholder={`${t('title')}`}
                autoFocus
                value={field.name}
                onChange={(e) => handleChangeField(e, index, 'name')}
              />
              <Checkbox
                name='checkbox'
                checked={field.value}
                onChange={(e) => handleChangeField(e, index, 'value', true)}
                sx={{ mx: 2 }}
              />

              <IconButton onClick={() => removeFields(index)}>
                <Delete />
              </IconButton>
            </Box>
          ) : field.type === 'textarea' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
              <TextField
                name='name'
                placeholder={`${t('title')}`}
                autoFocus
                value={field.name}
                onChange={(e) => handleChangeField(e, index, 'name')}
              />
              <TextField
                name='textarea'
                multiline
                rows={2}
                placeholder={`${t('text')}`}
                value={field.value}
                onChange={(e) => handleChangeField(e, index, 'value')}
                sx={{ mx: 2 }}
              />
              <IconButton onClick={() => removeFields(index)}>
                <Delete />
              </IconButton>
            </Box>
          ) : field.type === 'number' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
              <TextField
                name='name'
                placeholder={`${t('title')}`}
                autoFocus
                value={field.name}
                onChange={(e) => handleChangeField(e, index, 'name')}
              />
              <TextField
                name='number'
                type='number'
                placeholder='0'
                value={field.value}
                onChange={(e) => handleChangeField(e, index, 'value')}
                sx={{ mx: 2 }}
              />
              <IconButton onClick={() => removeFields(index)}>
                <Delete />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
              <TextField
                name='name'
                placeholder={`${t('title')}`}
                autoFocus
                value={field.name}
                onChange={(e) => handleChangeField(e, index, 'name')}
              />
              <TextField
                name={field.name}
                type={field.type}
                value={field.value}
                placeholder={`${t(`${field.type}`)}`}
                onChange={(e) => handleChangeField(e, index, 'value')}
                sx={{ mx: 2 }}
              />
              <IconButton
                onClick={() => removeFields(index)}
                aria-label='delete'
              >
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

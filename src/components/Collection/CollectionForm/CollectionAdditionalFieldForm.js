import { Delete } from '@mui/icons-material'
import { Box, IconButton, TextField } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function AdditionalFieldsForm({
  additionalFields,
  setAdditionalFields,
}) {
  const { t } = useTranslation()

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
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
      {additionalFields.map((field, index) => (
        <Box key={index} display={'flex'} mx={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <TextField
              name={field.name}
              value={field.name}
              placeholder={`name for ${t(`${field.type}`)} field`}
              onChange={(e) => handleChangeField(e, index, 'name')}
              sx={{ mx: 2 }}
            />
            <IconButton onClick={() => removeFields(index)} aria-label='delete'>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

import { Delete } from '@mui/icons-material'
import { Box, Checkbox, IconButton, TextField } from '@mui/material'
import React from 'react'

export default function AdditionalFieldsForm({
  additionalField,
  setAdditionalField,
}) {
  const handleChangeFields = (e, index, key, isCheckbox) => {
    let temp = [...additionalField]
    temp[index] = {
      ...temp[index],
      [key]: isCheckbox ? e.target.checked : e.target.value,
    }
    setAdditionalField(temp)
  }

  const removeFields = (index) => {
    let temp = [...additionalField]
    temp.splice(index, 1)
    setAdditionalField(temp)
  }

  return (
    <Box>
      {additionalField.map((field, index) => (
        <Box key={index} display={'flex'} mx={1}>
          {field.type === 'checkbox' ? (
            <Box>
              <TextField
                name='name'
                placeholder='Enter name'
                autoFocus
                value={field.name}
                onChange={(e) => handleChangeFields(e, index, 'name')}
                mx={1}
              />
              <Checkbox
                name='checkbox'
                checked={field.value}
                onChange={(e) => handleChangeFields(e, index, 'name', true)}
                mx={1}
              />
              <IconButton onClick={() => removeFields(index)}>
                <Delete />
              </IconButton>
            </Box>
          ) : field.type === 'textarea' ? (
            <Box>
              <TextField
                name='name'
                placeholder='Enter name'
                autoFocus
                value={field.name}
                onChange={(e) => handleChangeFields(e, index, 'name')}
              />
              <TextField
                name='textarea'
                multiline
                rows={2}
                placeholder='Enter text'
                value={field.value}
                onChange={(e) => handleChangeFields(e, index, 'value')}
              />
              <IconButton onClick={() => removeFields(index)}>
                <Delete />
              </IconButton>
            </Box>
          ) : field.type === 'number' ? (
            <Box>
              <TextField
                name='name'
                placeholder='Enter name'
                autoFocus
                value={field.name}
                onChange={(e) => handleChangeFields(e, index, 'name')}
              />
              <TextField
                name='number'
                type='number'
                placeholder='0'
                value={field.value}
                onChange={(e) => handleChangeFields(e, index, 'value')}
              />
              <IconButton onClick={() => removeFields(index)}>
                <Delete />
              </IconButton>
            </Box>
          ) : (
            <Box>
              <TextField
                name='name'
                placeholder='Enter name'
                autoFocus
                value={field.name}
                onChange={(e) => handleChangeFields(e, index, 'name')}
              />
              <TextField
                name={field.name}
                type={field.type}
                value={field.value}
                placeholder={`Enter ${field.type}`}
                onChange={(e) => handleChangeFields(e, index, 'value')}
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

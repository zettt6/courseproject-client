import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'

export default function AdditionalFieldsSelect({
  selectedField,
  additionalField,
  setSelectedField,
}) {
  const [open, setOpen] = useState(false)

  const toggleSelect = () => {
    setOpen(!open)
  }

  const handleChangeSelect = (e) => {
    setSelectedField(e.target.value)
  }

  return (
    <FormControl>
      <InputLabel>Fields</InputLabel>
      <Select
        sx={{
          minWidth: '100px',
          color: 'inherit',
        }}
        label='Fields'
        open={open}
        onClose={toggleSelect}
        onOpen={toggleSelect}
        value={selectedField}
        onChange={handleChangeSelect}
      >
        {additionalField.filter((field) => field.type === 'text').length !==
          3 && <MenuItem value={'text'}>string</MenuItem>}
        {additionalField.filter((field) => field.type === 'textarea').length !==
          3 && <MenuItem value={'textarea'}> multiline text</MenuItem>}
        {additionalField.filter((field) => field.type === 'number').length !==
          3 && <MenuItem value={'number'}>integer</MenuItem>}
        {additionalField.filter((field) => field.type === 'checkbox').length !==
          3 && <MenuItem value={'checkbox'}>checkbox yes/no</MenuItem>}
        {additionalField.filter((field) => field.type === 'date').length !==
          3 && <MenuItem value={'date'}>date</MenuItem>}
      </Select>
    </FormControl>
  )
}

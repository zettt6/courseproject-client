import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { capitalize } from '../../../../../utils/capitalize'

export const EditCollectionSelect = ({
  selectedField,
  additionalFields,
  setSelectedField,
}) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const toggleSelect = () => {
    setOpen(!open)
  }

  const handleChangeSelect = (e) => {
    setSelectedField(e.target.value)
  }

  return (
    <FormControl fullWidth>
      <InputLabel>{capitalize(`${t('add_more_fields')}`)}</InputLabel>
      <Select
        sx={{
          minWidth: '140px',
        }}
        label={`${t('add_more_fields')}`}
        open={open}
        onClose={toggleSelect}
        onOpen={toggleSelect}
        value={selectedField}
        onChange={handleChangeSelect}
      >
        {additionalFields.filter((field) => field.type === 'text').length !==
          3 && <MenuItem value={'string'}>{t('string')}</MenuItem>}
        {additionalFields.filter((field) => field.type === 'textarea')
          .length !== 3 && <MenuItem value={'textarea'}> {t('text')}</MenuItem>}
        {additionalFields.filter((field) => field.type === 'number').length !==
          3 && <MenuItem value={'number'}>{t('integer')}</MenuItem>}
        {additionalFields.filter((field) => field.type === 'checkbox')
          .length !== 3 && (
          <MenuItem value={'checkbox'}> {t('yes_no')}</MenuItem>
        )}
        {additionalFields.filter((field) => field.type === 'date').length !==
          3 && <MenuItem value={'date'}>{t('date')}</MenuItem>}
      </Select>
    </FormControl>
  )
}

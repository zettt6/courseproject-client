import { TextField } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function RequiredFields({ formik }) {
  const { t } = useTranslation()

  return (
    <>
      <TextField
        name='title'
        placeholder={`${t('title')}`}
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.title && !!formik.touched.title}
        helperText={!!formik.touched.title && formik.errors.title}
        sx={{ m: 1 }}
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
        sx={{ m: 1 }}
      />
      <TextField
        name='subject'
        placeholder={`${t('subject')}`}
        value={formik.values.subject}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.subject && !!formik.touched.subject}
        helperText={!!formik.touched.subject && formik.errors.subject}
        sx={{ m: 1 }}
      />
    </>
  )
}

/* <Autocomplete
          multiple
          options={topics}
          getOptionLabel={(option) => option}
          freeSolo
          autoSelect
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              // onKeyDown={handleKeyDown}
              {...params}
              placeholder='Enter topic'
            />
          )}
/> */

import { TextField } from '@mui/material'
import React from 'react'

export default function RequiredFields({ formik }) {
  return (
    <div>
      <TextField
        name='title'
        label='Title'
        placeholder='Enter title'
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.title && !!formik.touched.title}
        helperText={!!formik.touched.title && formik.errors.title}
        sx={{ m: 1 }}
      />
      <TextField
        name='description'
        label='Description'
        placeholder='Enter description'
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.description && !!formik.touched.description}
        helperText={!!formik.touched.description && formik.errors.description}
        sx={{ m: 1 }}
      />
      <TextField
        name='subject'
        label='Subject'
        placeholder='Enter subject'
        value={formik.values.subject}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!formik.errors.subject && !!formik.touched.subject}
        helperText={!!formik.touched.subject && formik.errors.subject}
        sx={{ m: 1 }}
      />
    </div>
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

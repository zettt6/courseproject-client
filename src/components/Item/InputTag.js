import { Autocomplete, Stack, TextField } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function InputTag() {
  const [tags, setTags] = useState([])

  const addTags = async () => {
    try {
      return axios.put('/items/tags/', {
        tags,
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return
    const value = e.target.value
    if (!value.trim()) return
    setTags([...tags, value])
    e.target.value = ''
    addTags()
  }

  return (
    <Stack spacing={3}>
      <Autocomplete
        multiple
        id='tags-outlined'
        options={tags}
        getOptionLabel={(option) => option}
        freeSolo
        autoSelect
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            onKeyDown={handleKeyDown}
            {...params}
            placeholder='add tag'
          />
        )}
      />
    </Stack>
  )
}

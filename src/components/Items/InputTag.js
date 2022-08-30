import { Autocomplete, Stack, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function InputTag() {
  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  // useEffect(() => {
  //   searchTag()
  // }, [inputValue])

  // const addTags = async () => {
  //   // !

  //   try {
  //     return axios.put('/items/tags/', {
  //       tags,
  //     })
  //   } catch (e) {
  //     toast.error(e.response.data.message)
  //   }
  // }

  const searchTag = async () => {
    // !
    // try {
    //   const response = await axios.get('/collections/search-tag', {
    //     params: {
    //       search: inputValue,
    //     },
    //   })
    //   setTags(response.data)
    // } catch (err) {
    //   toast.error(err.response.data.message)
    // }
  }

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return
    const value = e.target.value
    if (!value.trim()) return
    setTags([...tags, value])
    e.target.value = ''
  }

  return (
    <Stack spacing={3}>
      <Autocomplete
        multiple
        freeSolo
        autoSelect
        id='tags-outlined'
        options={tags}
        getOptionLabel={(option) => option}
        filterSelectedOptions
        onChange={(event, value) => setSelectedTag(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder='add tag'
            onKeyDown={handleKeyDown}
            onChange={({ target }) => {
              setInputValue(target.value)
            }}
            value={inputValue}
          />
        )}
      />
    </Stack>
  )
}

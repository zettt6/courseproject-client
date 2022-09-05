import { Autocomplete, Stack, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export const InputTag = ({ setSelectedTags }) => {
  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const { t } = useTranslation()

  // useEffect(() => {
  //   searchTag()
  // }, [inputValue])

  // const searchTag = async () => {
  //   // !
  //   try {
  //     const response = await axios.get('/items/search-tag', {
  //       params: {
  //         search: inputValue,
  //       },
  //     })
  //     // setTags(response.data)
  //     console.log(response.data)
  //   } catch (err) {
  //     toast.error(err.response.data.message)
  //   }
  // }

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
        onChange={(e, value) => setSelectedTags(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`${t('add_tag')}`}
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

{
  /* <Autocomplete
          disablePortal
          autoHighlight
          sx={{ width: '100%' }}
          options={users}
          getOptionLabel={(option) => {
            return option.username
          }}
          onChange={(event, value) => setSelectedUser(value.username)}
          onBlur={getSendedMessages}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder='To'
              onChange={({ target }) => {
                setInputValue(target.value)
              }}
              value={inputValue}
            />
          )}
        /> */
}

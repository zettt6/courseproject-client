import React, { useState } from 'react'
import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import toast from 'react-hot-toast'

export function SearchAppBar() {
  const [inputValue, setInputValue] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const { t } = useTranslation()

  const getSearchResult = async () => {
    try {
      const response = await axios.get(`/items/item-search`)
      // console.log(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <Box sx={{ mx: 2 }}>
      <Autocomplete
        disablePortal
        autoHighlight
        options={searchResults}
        getOptionLabel={(option) => {
          return option
        }}
        onBlur={getSearchResult}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`${t('search')}...`}
            onChange={handleInputChange}
            value={inputValue}
            variant='standard'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      {/* <Button variant='contained' onClick={itemSearch}>
        Search
      </Button> */}
    </Box>
  )
}

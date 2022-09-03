import React, { useContext } from 'react'
import { Box, Button, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'
import { AppContext } from '../../context'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import toast from 'react-hot-toast'

export function SearchAppBar() {
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  const itemSearch = async () => {
    try {
      const response = await axios.get(`/items/item-search`)
      // console.log(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '40px',
    marginRight: '20px',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }))

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }))

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }))

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder={`${t('search')}...`}
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>
      <Button variant='contained' onClick={itemSearch}>
        Search
      </Button>
    </Box>
  )
}

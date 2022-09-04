import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Box, Checkbox } from '@mui/material'
import axios from 'axios'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../../context'

export default function Likes({
  item,
  getItem,
  likeIconIsChecked,
  setLikeIconIsChecked,
  itemId,
}) {
  const appContext = useContext(AppContext)

  const handleLiked = async (e) => {
    e.stopPropagation()
    setLikeIconIsChecked(e.target.checked)
    await setLike()
  }

  const setLike = async () => {
    const token = localStorage.getItem('token')

    try {
      await axios.post(
        '/items/like',
        {
          userId: appContext.userData._id,
          itemId: itemId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (e) {
      toast.error(e.response.data.message)
    }
    getItem()
  }

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
      <Box>{item.likes}</Box>
      <Box>
        <Checkbox
          disabled={!appContext.userData}
          inputProps={{ 'aria-label': 'controlled' }}
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite sx={{ color: '#696969' }} />}
          checked={likeIconIsChecked}
          onClick={handleLiked}
        />
      </Box>
    </Box>
  )
}

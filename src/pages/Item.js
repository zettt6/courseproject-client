import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useParams } from 'react-router-dom'
import { Box, Checkbox, CircularProgress, Typography } from '@mui/material'
import axios from 'axios'
import CommentBox from '../components/Items/CommentBox'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { AppContext } from '../context'

export default function Item() {
  const [likeIconIsChecked, setLikeIconIsChecked] = useState(false)
  const [item, setItem] = useState([])
  const { itemId } = useParams()
  const appContext = useContext(AppContext)

  useEffect(() => {
    getItem()
  }, [])
  console.log(item)

  useEffect(() => {
    if (
      item?.whoLikeIt &&
      appContext.userData &&
      item.whoLikeIt.includes(appContext.userData._id)
    )
      setLikeIconIsChecked(true)
  }, [item])

  const getItem = async () => {
    try {
      const response = await axios.get(`/items/${itemId}`)
      setItem(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const handleLiked = async (e) => {
    e.stopPropagation()
    setLikeIconIsChecked(e.target.checked)
    await setLike()
  }

  const setLike = async () => {
    try {
      await axios.post('/items/like', {
        userId: appContext.userData._id,
        itemId: itemId,
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  return (
    <Box
      sx={{
        width: '70vw',
        display: 'flex',
        flexDirection: 'column',
        ml: '20vw',
      }}
    >
      <Typography variant='h6'>{item.title}</Typography>

      <Box>
        {appContext.userData && (
          <Checkbox
            inputProps={{ 'aria-label': 'controlled' }}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite sx={{ color: '#696969' }} />}
            checked={likeIconIsChecked}
            onClick={handleLiked}
          />
        )}
        <CommentBox item={item} getItem={getItem} />
      </Box>
    </Box>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import {
  Box,
  Checkbox,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material'
import axios from 'axios'
import CommentBox from '../components/Item/CommentBox'
import {
  CheckOutlined,
  CloseOutlined,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material'
import { AppContext } from '../context'
import { useTranslation } from 'react-i18next'

export default function Item() {
  const [likeIconIsChecked, setLikeIconIsChecked] = useState(false)
  const [item, setItem] = useState(null)
  const { itemId } = useParams()
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  useEffect(() => {
    getItem()
  }, [])

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
      const response = await axios.post('/items/like', {
        userId: appContext.userData._id,
        itemId: itemId,
      })
      console.log(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  return !item ? (
    <CircularProgress />
  ) : (
    <Box
      sx={{
        width: '70vw',
        ml: '20vw',
      }}
    >
      <Typography variant='h5' my={4}>
        {item.title}
      </Typography>
      <Box sx={{ width: '40%', marginLeft: 'auto' }}>
        <Paper
          key={Math.random()}
          color={'primary.contrasText'}
          sx={{
            my: 1,
            backgroundColor:
              appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
            borderRadius: '10px',
          }}
        >
          <Box sx={{ p: 2 }}>
            {Object.entries(item?.additionalFields)?.map(([key, value]) => (
              <Box display={'flex'}>
                {key}:
                {typeof value === 'boolean' && value === true ? (
                  <CheckOutlined />
                ) : typeof value === 'boolean' && value === false ? (
                  <CloseOutlined />
                ) : (
                  value
                )}
              </Box>
            ))}
          </Box>
        </Paper>
        <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
          <Box>{item.likes}</Box>
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
          </Box>
        </Box>
      </Box>

      <CommentBox item={item} getItem={getItem} />
    </Box>
  )
}

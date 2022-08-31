import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import {
  Box,
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material'
import axios from 'axios'
import CommentBox from '../components/Items/CommentBox'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
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
      await axios.post('/items/like', {
        userId: appContext.userData._id,
        itemId: itemId,
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  if (!item) return <CircularProgress />

  // likes no refresh

  return (
    <Box
      sx={{
        width: '70vw',
        ml: '20vw',
      }}
    >
      <Typography variant='h5' my={4}>
        {item.title}
      </Typography>
      <Box sx={{ width: '40%' }}>
        {item.additionalFields.length && (
          <>
            {item.additionalFields.map((field) => {
              return (
                <Paper
                  disablePadding
                  color={'primary.contrasText'}
                  sx={{
                    my: 1,
                    backgroundColor:
                      appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
                    borderRadius: '10px',
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    {field.name}: {field.value}
                  </Box>
                </Paper>
              )
            })}
          </>
        )}
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

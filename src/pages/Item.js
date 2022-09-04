import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import axios from 'axios'
import Comments from '../components/Item/Comments/Comments'
import { AppContext } from '../context'
import ListOfAdditionalFields from '../components/Item/ListOfAdditionalFields'
import Likes from '../components/Item/Likes'

export default function Item() {
  const [likeIconIsChecked, setLikeIconIsChecked] = useState(false)
  const [item, setItem] = useState(null)
  const { itemId } = useParams()
  const appContext = useContext(AppContext)

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

  return !item ? (
    <CircularProgress />
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '60vw',
        ml: '20vw',
      }}
    >
      <Typography variant='h5' my={8}>
        {item.title}
      </Typography>
      <Box sx={{ width: '40%' }}>
        <ListOfAdditionalFields item={item} />
        <Likes
          item={item}
          getItem={getItem}
          likeIconIsChecked={likeIconIsChecked}
          setLikeIconIsChecked={setLikeIconIsChecked}
          itemId={itemId}
        />
      </Box>

      <Comments item={item} getItem={getItem} />
    </Box>
  )
}

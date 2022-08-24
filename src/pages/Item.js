import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { Box } from '@mui/material'
import axios from 'axios'
import CommentBox from '../components/Item/CommentBox'

export default function Item() {
  const [item, setItem] = useState([])
  const { id } = useParams()

  useEffect(() => {
    getItem()
  }, [])

  const getItem = async () => {
    try {
      const response = await axios.get(`/items/${id}`)
      setItem(response.data)
      console.log(response.data)
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
      }}
    >
      <CommentBox item={item} getItem={getItem} />
    </Box>
  )
}

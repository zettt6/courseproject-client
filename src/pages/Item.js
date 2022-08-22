import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import CommentBox from '../components/Item/CommentBox'

export default function Collection() {
  const [items, setItems] = useState([])

  useEffect(() => {
    getItems()
  }, [])

  const getItems = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('/items', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setItems(response.data)
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  return (
    <Box>
      items:
      {!items && (
        <Box>
          {items.map((item) => {
            return (
              <Box>{item}</Box>
              // <Box>{item.likes}</Box>
            )
          })}
        </Box>
      )}
      <CommentBox />
    </Box>
  )
}

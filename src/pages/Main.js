import { Box } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../components/Collection/Card'

export default function Main() {
  const [biggestCollections, setBiggestCollections] = useState([])

  useEffect(() => {
    getTheBiggestCollections()
  }, [])

  const getTheBiggestCollections = async () => {
    try {
      const response = await axios.get('/collections/limit')
      setBiggestCollections(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  return (
    <Box
      sx={{
        width: '70vw',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        my: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {biggestCollections.map((collection) => (
          <Card
            title={collection.title}
            description={collection.description}
            subject={collection.subject}
            key={collection._id}
            collectionId={collection._id}
          />
        ))}
      </Box>
    </Box>
  )
}

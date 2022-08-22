import { Box } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../context'
import Card from '../components/Collection/Card'
import { useNavigate } from 'react-router-dom'

export default function Main() {
  const appContext = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    getCollections()
  }, [])

  const getCollections = async () => {
    try {
      const response = await axios.get('/collection')
      appContext.setCollections(response.data)
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  const goToCollectionPage = () => {
    // navigate(`/collection/:${id}`)
    navigate('/collection')
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
        {appContext.collections.map((collection) => (
          <Card
            title={collection.title}
            description={collection.description}
            subject={collection.subject}
            key={collection._id}
            // onClick={goToCollectionPage(collection._id)}
            goToCollectionPage={goToCollectionPage}
          />
        ))}
      </Box>
    </Box>
  )
}

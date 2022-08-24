import React, { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import axios from 'axios'
import toast from 'react-hot-toast'
import Card from '../components/Collection/Card'
import CollectionForm from '../components/Collection/CollectionForm'
import { AppContext } from '../context'

export default function Profile() {
  const [collections, setCollections] = useState([])
  const [selectedCollections, setSelectedCollections] = useState([])
  const appContext = useContext(AppContext)

  useEffect(() => {
    getCollections()
  }, [])

  const getCollections = async () => {
    try {
      const response = await axios.get('/collections', {
        params: {
          creatorId: appContext.userData._id,
        },
      })
      setCollections(response.data)
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
      <CollectionForm getCollections={getCollections} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {collections.map((collection) => (
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

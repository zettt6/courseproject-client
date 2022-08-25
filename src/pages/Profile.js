import React, { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import axios from 'axios'
import toast from 'react-hot-toast'
import CollectionCard from '../components/Collection/CollectionCard'
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

  const deleteCollections = async (e) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')

    const requests = selectedCollections.map((selectedCollection) => {
      try {
        return axios.delete(`/collections/delete/:${selectedCollection}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (e) {
        toast.error(e.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getCollections()
    })
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
          <CollectionCard
            title={collection.title}
            description={collection.description}
            subject={collection.subject}
            image={collection.image}
            key={collection._id}
            collectionId={collection._id}
            getCollections={getCollections}
            setSelectedCollections={setSelectedCollections}
            deleteCollections={deleteCollections}
          />
        ))}
      </Box>
    </Box>
  )
}

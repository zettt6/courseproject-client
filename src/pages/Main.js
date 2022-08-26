import { Box } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CollectionCard from '../components/Collection/CollectionCard'

export default function Main() {
  const [biggestCollections, setBiggestCollections] = useState([])
  const [selectedCollections, setSelectedCollections] = useState([])

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

  const deleteCollections = async (e) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')
    let queryParams = ''
    selectedCollections.forEach(
      (collection) => (queryParams += `collections[]=${collection}&`)
    )
    try {
      await axios.delete(`/collections/delete?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
    getTheBiggestCollections()
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
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {biggestCollections.map((collection) => (
          <CollectionCard
            title={collection.title}
            description={collection.description}
            subject={collection.subject}
            image={collection.image}
            key={collection._id}
            collectionId={collection._id}
            getCollection={getTheBiggestCollections}
            setSelectedCollections={setSelectedCollections}
            deleteCollections={deleteCollections}
          />
        ))}
      </Box>
    </Box>
  )
}

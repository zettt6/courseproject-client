import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Paper } from '@mui/material'
import { Box } from '@mui/system'
import Card from '../components/Collection/Card'
import Form from '../components/Collection/Form'

export default function Profile() {
  const [selectedCollections, setSelectedCollections] = useState([])
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

  const createCollection = async (values) => {
    try {
      const response = await axios.post('/collection', {
        title: values.title,
        description: values.description,
        subject: values.subject,
      })
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  const deleteCollections = async () => {
    console.log(selectedCollections)
  }

  const goToCollectionPage = (id) => {
    console.log(1)
    // navigate(`/collection/:${id}`)
    navigate('/collection')
  }

  return (
    <Box>
      <Paper
        sx={{
          width: '900px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          my: 2,
        }}
      >
        <Form
          createCollection={createCollection}
          deleteCollections={deleteCollections}
        />
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
      </Paper>
    </Box>
  )
}

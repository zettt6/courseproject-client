import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context'
import { Box } from '@mui/system'
import axios from 'axios'
import toast from 'react-hot-toast'
import Card from '../components/Collection/Card'
import Form from '../components/Collection/Form'
import UploadImage from '../components/Collection/UploadImage'

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

  const goToItemPage = () => {
    console.log(1)
    // navigate(`/collection/:${id}`)
    navigate('/item')
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
      <Form />
      <UploadImage />
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {appContext.collections.map((collection) => (
          <Card
            title={collection.title}
            description={collection.description}
            subject={collection.subject}
            key={collection._id}
            // onClick={goToCollectionPage(collection._id)}
            goToCollectionPage={goToItemPage}
          />
        ))}
      </Box>
    </Box>
  )
}

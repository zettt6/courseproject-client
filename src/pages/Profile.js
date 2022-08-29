import React, { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import axios from 'axios'
import toast from 'react-hot-toast'
import CollectionCard from '../components/Collection/CollectionCard.js'
import Popup from '../components/Collection/CollectionForm/Popup'
import { AppContext } from '../context'
import { Paper, Toolbar, Button, styled, CircularProgress } from '@mui/material'

export default function Profile() {
  const [collections, setCollections] = useState([])
  const [selectedCollections, setSelectedCollections] = useState([])
  const [collectionIsChecked, setCollectionIsChecked] = useState(false)
  const [collectionFormPopupIsOpen, setCollectionFormPopupIsOpen] =
    useState(false)
  const [loading, setLoading] = useState(false)

  const appContext = useContext(AppContext)

  useEffect(() => {
    getCollections()
  }, [])

  const getCollections = async () => {
    setLoading(true)
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
    setLoading(false)
  }

  const deleteCollections = async (e) => {
    e.stopPropagation()
    setLoading(true)

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
    getCollections()
    setLoading(false)
  }

  const StyledToolbar = styled(Toolbar)(() => ({
    '@media all': {
      minHeight: 30,
    },
    justifyContent: 'flex-end',
    paddingBottom: '40px',
  }))

  function toggleCollectionFormPopup() {
    setCollectionFormPopupIsOpen(!collectionFormPopupIsOpen)
  }

  return (
    <Box
      sx={{
        width: '70vw',
        // margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        my: 3,
        ml: '20vw',
      }}
    >
      <Paper
        sx={{
          backgroundColor: 'inherit',
          p: 3,
          width: '70vw',
        }}
      >
        <StyledToolbar>
          {collectionIsChecked && (
            <Button
              color='inherit'
              variant='contained'
              onClick={deleteCollections}
            >
              delete
            </Button>
          )}
          <Button
            sx={{ mx: 2 }}
            color='inherit'
            onClick={toggleCollectionFormPopup}
          >
            create collection
          </Button>
          <Popup
            collectionFormPopupIsOpen={collectionFormPopupIsOpen}
            toggleCollectionFormPopup={toggleCollectionFormPopup}
            getCollections={getCollections}
          />
        </StyledToolbar>

        {!collections.length && (
          <Box textAlign={'center'} my={7}>
            your collection's list is empty
          </Box>
        )}
        {loading ? (
          <CircularProgress />
        ) : (
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
                collectionIsChecked={collectionIsChecked}
                setCollectionIsChecked={setCollectionIsChecked}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

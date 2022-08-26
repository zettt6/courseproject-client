import React, { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import axios from 'axios'
import toast from 'react-hot-toast'
import CollectionCard from '../components/Collection/CollectionCard'
import CollectionFormPopup from '../components/Collection/CollectionFormPopup'
import { AppContext } from '../context'
import { Paper, Toolbar, Button, styled } from '@mui/material'

export default function Profile() {
  const [collections, setCollections] = useState([])
  const [selectedCollections, setSelectedCollections] = useState([])
  const [collectionIsChecked, setCollectionIsChecked] = useState(false)
  const [collectionFormPopupIsOpen, setCollectionFormPopupIsOpen] =
    useState(false)

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
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        my: 2,
      }}
    >
      <Paper sx={{ backgroundColor: 'inherit', p: 3, width: '70vw' }}>
        <StyledToolbar>
          <Button color='inherit' onClick={toggleCollectionFormPopup}>
            create collection
          </Button>
          <CollectionFormPopup
            collectionFormPopupIsOpen={collectionFormPopupIsOpen}
            toggleCollectionFormPopup={toggleCollectionFormPopup}
            getCollections={getCollections}
          />
          {collectionIsChecked && (
            <Button color='inherit' onClick={deleteCollections}>
              delete
            </Button>
          )}
        </StyledToolbar>
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
      </Paper>
    </Box>
  )
}

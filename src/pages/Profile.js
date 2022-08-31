import React, { useContext, useEffect, useState } from 'react'
import {
  Paper,
  Toolbar,
  Button,
  styled,
  CircularProgress,
  Box,
} from '@mui/material'
import axios from 'axios'
import toast from 'react-hot-toast'
import CollectionCard from '../components/Collections/CollectionCard.js'
import Popup from '../components/Collections/CollectionForm/Popup'
import { AppContext } from '../context'
import { useTranslation } from 'react-i18next'

export default function Profile() {
  const [collections, setCollections] = useState([])
  const [selectedCollections, setSelectedCollections] = useState([])
  const [collectionFormPopupIsOpen, setCollectionFormPopupIsOpen] =
    useState(false)
  const [loading, setLoading] = useState(false)

  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  useEffect(() => {
    getCollections()
  }, [])

  const getCollections = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/collections', {
        params: {
          creator: appContext.userData.username,
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

  const handleCollectionIsChecked = (e, collectionId, collectionIsChecked) => {
    e.stopPropagation()
    if (collectionIsChecked) {
      let temp = [...collections]
      temp.splice(collectionId, 1)
      setSelectedCollections(temp)
    } else {
      let temp = [...collections]
      temp.push(collectionId)
      setSelectedCollections(temp)
    }
  }

  return (
    <Box
      sx={{
        width: '70vw',
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
          {!!selectedCollections.length && (
            <Button
              color='inherit'
              variant='contained'
              onClick={deleteCollections}
            >
              {t('delete')}
            </Button>
          )}
          <Button color='inherit' onClick={toggleCollectionFormPopup}>
            {t('create')}
          </Button>
          <Popup
            collectionFormPopupIsOpen={collectionFormPopupIsOpen}
            toggleCollectionFormPopup={toggleCollectionFormPopup}
            getCollections={getCollections}
          />
        </StyledToolbar>

        {!collections.length && (
          <Box textAlign={'center'} my={7}>
            {t('empty_list')}
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
                handleCollectionIsChecked={handleCollectionIsChecked}
                collectionIsChecked={
                  !!selectedCollections.find((id) => id === collection._id)
                }
              />
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

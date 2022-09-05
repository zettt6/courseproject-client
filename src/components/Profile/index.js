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
import { CollectionCard } from '../CollectionCard'
import { CollectionPopup } from '../Profile/components/CollectionPopup'
import { AppContext } from '../../context'
import { useTranslation } from 'react-i18next'

export const Profile = () => {
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  const [collections, setCollections] = useState(null)
  const [selectedCollections, setSelectedCollections] = useState([])
  const [collectionFormPopupIsOpen, setCollectionFormPopupIsOpen] =
    useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCollections()
  }, [])

  const getCollections = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/collections', {
        params: {
          creatorName: appContext.userData.username,
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

  function toggleCollectionFormPopup() {
    setCollectionFormPopupIsOpen(!collectionFormPopupIsOpen)
  }

  const collectionChecked = (e, collectionId, collectionIsChecked) => {
    e.stopPropagation()

    const temp = [...selectedCollections]
    if (collectionIsChecked) {
      temp.splice(collectionId, 1)
    } else {
      temp.push(collectionId)
    }
    setSelectedCollections(temp)
  }

  const selectAll = () => {
    setSelectedCollections(collections.map((collection) => collection._id))
  }

  const clearAll = () => {
    setSelectedCollections([])
  }

  const StyledToolbar = styled(Toolbar)(() => ({
    '@media all': {
      minHeight: 30,
    },
    justifyContent: 'flex-end',
    paddingBottom: '40px',
    color: appContext.theme === 'light' ? '#4c4c4c' : '#696969',
  }))

  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
    color: appContext.theme === 'light' ? '#4c4c4c' : '#000000',
    '&:hover': {
      backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#868686',
    },
  }))

  return !collections ? (
    <CircularProgress />
  ) : (
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
            <>
              <StyledButton variant='contained' onClick={selectAll}>
                {t('select_all')}
              </StyledButton>
              <StyledButton
                sx={{ mx: 1 }}
                variant='contained'
                onClick={clearAll}
              >
                {t('clear_all')}
              </StyledButton>
              <StyledButton
                variant='contained'
                onClick={deleteCollections}
                sx={{ mx: 1 }}
              >
                {t('delete')}
              </StyledButton>
            </>
          )}
          <Button color='inherit' onClick={toggleCollectionFormPopup}>
            {t('create')}
          </Button>
          <CollectionPopup
            collectionFormPopupIsOpen={collectionFormPopupIsOpen}
            toggleCollectionFormPopup={toggleCollectionFormPopup}
            getCollections={getCollections}
          />
        </StyledToolbar>

        {collections && !collections.length && (
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
                topic={collection.topic}
                image={collection.image}
                key={collection._id}
                collectionId={collection._id}
                getCollections={getCollections}
                setSelectedCollections={setSelectedCollections}
                deleteCollections={deleteCollections}
                collectionChecked={collectionChecked}
                collectionIsChecked={
                  !!selectedCollections.find((id) => id === collection._id)
                }
                collection={collection}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

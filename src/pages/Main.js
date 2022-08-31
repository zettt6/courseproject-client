import { Box, List, ListItem, Pagination, Typography } from '@mui/material'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import CollectionCard from '../components/Collections/CollectionCard'
import { AppContext } from '../context'
import capitalize from '../utils/capitalize'

export default function Main() {
  const [biggestCollections, setBiggestCollections] = useState([])
  const [lastAddedItems, setLastAddedItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [count, setCount] = useState(0)
  const appContext = useContext(AppContext)

  const { t } = useTranslation()

  useEffect(() => {
    getTheBiggestCollections()
    getLastAddedItems()
  }, [])

  useEffect(() => {
    getLastAddedItems()
  }, [currentPage])

  const getTheBiggestCollections = async () => {
    try {
      const response = await axios.get('/collections/limit')
      setBiggestCollections(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const getLastAddedItems = async () => {
    try {
      const response = await axios.get(
        `/items/latest?page=${currentPage}&perPage=${5}`
      )
      setLastAddedItems(response.data.docs)
      setCurrentPage(response.data.page)
      setCount(response.data.totalPages)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        my: 3,
        ml: '20vw',
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
          />
        ))}
      </Box>
      <Box>
        <Typography variant='h6' color={'primary.contrasText'}>
          {capitalize(`${t('latest_added_collection_items')}`)}
        </Typography>

        <Pagination
          sx={{ my: 2 }}
          count={count}
          page={currentPage}
          onChange={handleChangePage}
        />
        <Box sx={{ width: '20vw' }}>
          {lastAddedItems.map((item) => {
            return (
              <>
                <List
                  disablePadding
                  color={'primary.contrasText'}
                  sx={{
                    my: 1,
                    backgroundColor:
                      appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
                    borderRadius: '10px',
                    overflowX: 'hidden',
                  }}
                  key={item._id}
                >
                  <ListItem sx={{ p: 1 }}>
                    {t('name')}: {item.title}
                  </ListItem>
                  <ListItem sx={{ p: 1 }}>
                    {t('collection')}: {item.collectionId}
                  </ListItem>
                  <ListItem sx={{ p: 1 }}>
                    {t('creator')}: {item.creator}
                  </ListItem>
                </List>
              </>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Pagination,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import CollectionCard from '../components/Collection/CollectionCard'
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
      setLastAddedItems(response.data.items.docs)
      setCurrentPage(response.data.items.page)
      setCount(response.data.items.totalPages)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage)
  }

  return !lastAddedItems && !biggestCollections ? (
    <CircularProgress />
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        my: 3,
        ml: '20vw',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '50vw',
          flexWrap: 'wrap',
        }}
      >
        {biggestCollections.map((collection) => (
          <CollectionCard
            title={collection.title}
            description={collection.description}
            topic={collection.topic}
            image={collection.image}
            key={collection._id}
            collectionId={collection._id}
            getCollection={getTheBiggestCollections}
          />
        ))}
      </Box>
      <Box>
        <Typography
          variant='h6'
          sx={{ color: appContext.theme === 'light' ? '#4c4c4c' : '#696969' }}
        >
          {capitalize(`${t('latest_added_collection_items')}`)}
        </Typography>

        {count > 1 && (
          <Pagination
            my={2}
            count={count}
            page={currentPage}
            onChange={handleChangePage}
          />
        )}

        <Box sx={{ width: '20vw' }}>
          {lastAddedItems.map((item) => {
            return (
              <List
                key={item._id}
                disablePadding
                color={'primary.contrasText'}
                sx={{
                  my: 1,
                  backgroundColor:
                    appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
                  borderRadius: '10px',
                  overflowX: 'hidden',
                }}
              >
                <ListItem sx={{ p: 1 }}>
                  {t('name')}: {item.title}
                </ListItem>
                <ListItem sx={{ p: 1 }}>
                  {t('collection_name')}: {item.collectionName}
                </ListItem>
                <ListItem sx={{ p: 1 }}>
                  {t('creator')}: {item.creator}
                </ListItem>
              </List>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

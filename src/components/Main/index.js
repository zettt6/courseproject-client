import { Box, CircularProgress, Pagination, Typography } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { CollectionCard } from '../CollectionCard'
import { AppContext } from '../../context'
import { capitalize } from '../../utils/capitalize'
import { ListLastAddedItems } from './components/ListLastAddedItems'

export const Main = () => {
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  const [biggestCollections, setBiggestCollections] = useState([])
  const [lastAddedItems, setLastAddedItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [count, setCount] = useState(0)

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
          sx={{
            my: 2,
            color: appContext.theme === 'light' ? '#4c4c4c' : '#696969',
          }}
        >
          {capitalize(`${t('latest_added_collection_items')}`)}
        </Typography>

        {count > 1 && (
          <Pagination
            count={count}
            page={currentPage}
            onChange={handleChangePage}
          />
        )}
        <ListLastAddedItems lastAddedItems={lastAddedItems} />
      </Box>
    </Box>
  )
}

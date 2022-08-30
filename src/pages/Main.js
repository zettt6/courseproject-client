import {
  Box,
  Button,
  List,
  ListItem,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CollectionCard from '../components/Collections/CollectionCard'
import { AppContext } from '../context'

export default function Main() {
  const [biggestCollections, setBiggestCollections] = useState([])
  const [lastAddedItems, setLastAddedItems] = useState([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(5)
  const appContext = useContext(AppContext)

  useEffect(() => {
    getTheBiggestCollections()
    getLastAddedItems()
  }, [])

  const getTheBiggestCollections = async () => {
    try {
      const response = await axios.get('/collections/limit')
      setBiggestCollections(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const getLastAddedItems = async () => {
    // limit
    // reload list
    try {
      const response = await axios.get(
        `/items/latest?page=${page}&perPage=${count}`
      )
      setLastAddedItems(response.data.docs)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const handleChangePage = (e, newPage) => {
    setPage(newPage)
  }

  return (
    <Box
      sx={{
        width: '70vw',
        display: 'flex',
        alignItems: 'flex-start',
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
        <Typography variant='h6'>Last added items</Typography>
        <Box sx={{ width: '20vw' }}>
          {lastAddedItems.map((item) => {
            return (
              <List
                disablePadding
                sx={{
                  my: 1,
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  overflowX: 'hidden',
                }}
                key={item._id}
              >
                <ListItem sx={{ p: 1 }}>name: {item.title}</ListItem>
                <ListItem sx={{ p: 1 }}>
                  collection: {item.collectionId}
                </ListItem>
                <ListItem sx={{ p: 1 }}>creator: {item.creator}</ListItem>
              </List>
            )
          })}
        </Box>
        <Pagination count={count} page={page} onChange={handleChangePage} />
      </Box>
    </Box>
  )
}

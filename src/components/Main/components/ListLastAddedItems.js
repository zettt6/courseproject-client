import { Box, List, ListItem } from '@mui/material'
import React from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../../../context'

export const ListLastAddedItems = ({ lastAddedItems }) => {
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  return (
    <Box sx={{ width: '20vw' }}>
      {lastAddedItems.map((item) => {
        return (
          <List
            key={item._id}
            disablePadding
            color={'primary.contrasText'}
            sx={{
              my: 2,
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
              {t('creator')}: {item.creatorName}
            </ListItem>
          </List>
        )
      })}
    </Box>
  )
}

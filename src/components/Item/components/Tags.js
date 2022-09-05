import { Box } from '@mui/material'
import React, { useContext } from 'react'
import { AppContext } from '../../../context'

export const Tags = ({ item }) => {
  const appContext = useContext(AppContext)

  return (
    <Box display={'flex'}>
      {item.tags.map((tag) => {
        return (
          <div
            key={Math.random()}
            sx={{
              mx: 0.5,
              p: 0.5,
              backgroundColor:
                appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
            }}
          >
            #{tag}
          </div>
        )
      })}
    </Box>
  )
}

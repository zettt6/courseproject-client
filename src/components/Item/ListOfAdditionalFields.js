import { CheckOutlined, CloseOutlined } from '@mui/icons-material'
import { Box, Paper } from '@mui/material'
import React, { useContext } from 'react'
import { AppContext } from '../../context'

export default function ListOfAdditionalFields({ item }) {
  const appContext = useContext(AppContext)

  return (
    <Paper
      key={Math.random()}
      color={'primary.contrasText'}
      sx={{
        my: 1,
        backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
        borderRadius: '10px',
      }}
    >
      <Box sx={{ p: 2 }}>
        {Object.entries(item?.additionalFields)?.map(([key, value]) => (
          <Box display={'flex'} key={Math.random()}>
            {key}:
            {typeof value === 'boolean' && value === true ? (
              <CheckOutlined />
            ) : typeof value === 'boolean' && value === false ? (
              <CloseOutlined />
            ) : (
              value
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  )
}

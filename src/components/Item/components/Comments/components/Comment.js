import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { AppContext } from '../../../../../context'

export const Comment = ({ author, text }) => {
  const appContext = useContext(AppContext)

  return (
    <Box
      sx={{
        padding: '10px 20px',
        my: 0.5,
        backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : 'inherit',
        color: appContext.theme === 'light' ? '#4c4c4c' : '#868686',
        borderRadius: '10px',
      }}
    >
      <Box>
        <Grid container wrap='nowrap' spacing={1}>
          <Grid textAlign='left' item xs zeroMinWidth>
            <Typography sx={{ fontWeight: 'bold' }}>{author}</Typography>
            <Typography>{text}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

import { Box, Divider, Grid, Typography } from '@mui/material'
import React from 'react'

export default function Comment({ author, text, id }) {
  return (
    <Box key={id}>
      <Grid container wrap='nowrap' spacing={1}>
        <Grid textAlign='left' item xs zeroMinWidth>
          <Typography sx={{ fontWeight: 'bold' }}>{author}</Typography>
          <Typography>{text}</Typography>
        </Grid>
      </Grid>
      <Divider variant='fullWidth' sx={{ margin: '30px 0' }} />
    </Box>
  )
}

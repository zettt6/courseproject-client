import { Box, Divider, Grid, Paper, Typography } from '@mui/material'
import React from 'react'

export default function Comment({ author, text, id }) {
  return (
    <Paper sx={{ padding: '10px 20px', my: 0.5, backgroundColor: 'inherit' }}>
      <Box key={id}>
        <Grid container wrap='nowrap' spacing={1}>
          <Grid textAlign='left' item xs zeroMinWidth>
            <Typography sx={{ fontWeight: 'bold' }}>{author}</Typography>
            <Typography>{text}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

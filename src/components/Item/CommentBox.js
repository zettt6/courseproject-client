import React, { useState } from 'react'
import { Box } from '@mui/system'
import { Button, Divider, Grid, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

export default function CommentBox() {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <Box
      sx={{
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant='h6'>Comments</Typography>
      <Box sx={{ my: 5 }}>
        <Grid container wrap='nowrap' spacing={1}>
          <Grid justifyContent='left' item xs zeroMinWidth>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold' }}>
              Author
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              luctus ut est sed
            </Typography>
          </Grid>
        </Grid>
        <Divider variant='fullWidth' sx={{ margin: '30px 0' }} />
        <Grid container wrap='nowrap' spacing={1}>
          <Grid justifyContent='left' item xs zeroMinWidth>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold' }}>
              Author
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              luctus ut est sed
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <TextField
        multiline
        maxRows={2}
        value={value}
        onChange={handleChange}
        placeholder='Add a comment...'
        variant='standard'
        fullWidth
      />
      <Box sx={{ marginLeft: 'auto' }}>
        <Button variant='contained' color='inherit' sx={{ m: 1 }}>
          Cancel
        </Button>
        <Button
          variant='contained'
          color='inherit'
          sx={{ m: 1 }}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}

import { FavoriteBorderOutlined } from '@mui/icons-material'
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material'
import React from 'react'

export default function CollectionCard({
  title,
  description,
  subject,
  goToCollectionPage,
}) {
  return (
    <Card
      sx={{
        width: 300,
        m: 2,
        ':hover': { backgroundColor: '#d3d3d33b', cursor: 'pointer' },
      }}
      onClick={goToCollectionPage}
    >
      <CardMedia
        component='img'
        height='150'
        // image=''
        alt='collection image'
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {title}
        </Typography>
        <Typography variant='body3'>{subject}</Typography>
        <Typography variant='body2'>{description}</Typography>
      </CardContent>

      <CardActions>
        <IconButton
          sx={{ marginLeft: 'auto' }}
          aria-label='like'
          color='inherit'
        >
          <FavoriteBorderOutlined />
        </IconButton>
      </CardActions>
    </Card>
  )
}

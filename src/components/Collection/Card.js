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
import { useNavigate } from 'react-router-dom'

export default function CollectionCard({
  title,
  description,
  subject,
  collectionId,
}) {
  const navigate = useNavigate()

  const goToCollectionPage = () => {
    navigate(`/collection/${collectionId}`)
  }

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

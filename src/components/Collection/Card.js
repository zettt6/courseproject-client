import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
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
    <Card sx={{ width: 150, m: 2 }} onClick={goToCollectionPage}>
      <CardActionArea>
        <CardMedia
          component='img'
          height='140'
          // image=''
          alt='collection'
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {title}
          </Typography>
          <Typography variant='body3' color='text.secondary'>
            {subject}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

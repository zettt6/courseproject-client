import {
  Box,
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
    <div>
      <Card sx={{ width: 150, m: 2 }} onClick={goToCollectionPage}>
        <CardActionArea>
          {/* <CardMedia
            component='img'
            height='140'
            image='/static/images/cards/contemplative-reptile.jpg'
            alt='green iguana'
          /> */}
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {description}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {subject}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}

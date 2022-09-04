import { Favorite, FavoriteBorder, ModeEditOutline } from '@mui/icons-material'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  IconButton,
  styled,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context'
import noimg from '../../icons/noimg.svg'

export default function CollectionCard({
  title,
  description,
  topic,
  collectionId,
  image,
  collectionIsChecked,
  collectionChecked,
}) {
  // const [editMode, setEditMode] = useState(false)
  const navigate = useNavigate()
  const appContext = useContext(AppContext)
  const location = useLocation()

  const goToCollectionPage = () => {
    navigate(`/collections/${collectionId}`)
  }

  const StyledCard = styled(Card)(({ theme }) => ({
    width: '300px',
    margin: '10px',
    padding: '12px',
    borderRadius: '20px',
    backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',

    '&:hover': {
      cursor: 'pointer',
      boxShadow:
        appContext.theme === 'light'
          ? '1px 0px 14px 0px rgba(0,0,0,0.6)'
          : '1px 0px 14px 0px rgba(255,255,255,0.6)',
    },
    '&:hover .MuiCardHeader-root': {
      opacity: 1,
    },
  }))

  const editCollection = (e) => {
    // !
    e.stopPropagation()
    // setEditMode(true)
  }

  return (
    <StyledCard onClick={goToCollectionPage}>
      {appContext.userData && location.pathname === '/profile' && (
        <CardHeader
          sx={{ opacity: 0 }}
          action={
            <Box>
              <Checkbox
                edge='start'
                checked={collectionIsChecked}
                onClick={(e) =>
                  collectionChecked(e, collectionId, collectionIsChecked)
                }
              />
              <IconButton
                edge='end'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={editCollection}
              >
                <ModeEditOutline />
              </IconButton>
            </Box>
          }
        />
      )}

      <CardMedia
        sx={{ borderRadius: '10px' }}
        component='img'
        height='200px'
        width='100px'
        image={image ? image : noimg}
        alt='collection image'
      />

      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {title}
        </Typography>
        <Typography variant='body3'>{topic}</Typography>
        <Typography variant='body2'>{description}</Typography>
      </CardContent>
    </StyledCard>
  )
}

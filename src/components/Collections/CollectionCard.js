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
  subject,
  collectionId,
  image,
  collectionIsChecked,
  handleCollectionIsChecked,
  setSelectedCollections,
  deleteCollections,
}) {
  const [likeIconIsChecked, setLikeIconIsChecked] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const navigate = useNavigate()
  const appContext = useContext(AppContext)
  const location = useLocation()

  useEffect(() => {
    if (appContext.userData && appContext.userData.likes.includes(collectionId))
      setLikeIconIsChecked(true)
  }, [])

  const handleLiked = async (e) => {
    e.stopPropagation()
    setLikeIconIsChecked(e.target.checked)
    await setLike()
  }

  const setLike = async () => {
    try {
      await axios.post('/user/like', {
        userId: appContext.userData._id,
        collectionId: collectionId,
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const goToCollectionPage = () => {
    navigate(`/collections/${collectionId}`)
  }

  const StyledCard = styled(Card)(({ theme }) => ({
    width: '300px',
    margin: '10px',
    padding: '12px',
    borderRadius: '20px',
    backgroundColor: appContext.theme === 'light' ? '#d2d2d2' : '#4c4c4c',
    '&:hover': {
      cursor: 'pointer',
      boxShadow:
        appContext.theme === 'light'
          ? '1px 0px 14px 0px rgba(0,0,0,0.6)'
          : '1px 0px 14px 0px rgba(255,255,255,0.6)',
      backgroundColor: appContext.theme === 'light' ? '#ffffff3b' : '#6b6b6b',
    },
    '&:hover .MuiCardHeader-root': {
      opacity: 1,
    },
  }))

  const editCollection = (e) => {
    // !
    e.stopPropagation()
    setEditMode(true)
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
                  handleCollectionIsChecked(
                    e,
                    collectionId,
                    collectionIsChecked
                  )
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
        <Typography variant='body3'>{subject}</Typography>
        <Typography variant='body2'>{description}</Typography>
      </CardContent>
      {appContext.userData && location.pathname !== '/profile' && (
        <CardActions>
          <Checkbox
            edge='end'
            sx={{ marginLeft: 'auto' }}
            inputProps={{ 'aria-label': 'controlled' }}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite sx={{ color: '#696969' }} />}
            checked={likeIconIsChecked}
            onClick={handleLiked}
          />
        </CardActions>
      )}
    </StyledCard>
  )
}

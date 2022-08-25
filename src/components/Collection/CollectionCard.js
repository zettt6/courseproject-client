import { Favorite, FavoriteBorder } from '@mui/icons-material'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  styled,
  Typography,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context'
import noimg from '../../icons/noimg.svg'

export default function CollectionCard({
  title,
  description,
  subject,
  collectionId,
  image,
  setSelectedCollections,
  deleteCollections,
}) {
  const [liked, setLiked] = useState(false)
  const [collectionIsChecked, setCollectionIsChecked] = useState(false)
  const navigate = useNavigate()
  const appContext = useContext(AppContext)

  const handleLiked = (e) => {
    e.stopPropagation()
    setLiked(e.target.checked)
  }

  const handleCollectionIsChecked = (e) => {
    e.stopPropagation()
    setCollectionIsChecked(e.target.checked)
    setSelectedCollections((collections) => [...collections, collectionId])
  }

  const goToCollectionPage = () => {
    navigate(`/collections/${collectionId}`)
  }

  const StyledCard = styled(Card)(({ theme }) => ({
    width: '300px',
    height: '460px',
    margin: '10px',
    padding: '10px',
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
  }))

  return (
    <StyledCard onClick={goToCollectionPage}>
      <CardHeader
        action={
          <>
            {collectionIsChecked && (
              <Button color='inherit' onClick={deleteCollections}>
                delete
              </Button>
            )}
            <Checkbox
              inputProps={{ 'aria-label': 'controlled' }}
              checked={collectionIsChecked}
              onClick={handleCollectionIsChecked}
            />
          </>
        }
      />
      <CardMedia
        sx={{ borderRadius: '10px' }}
        component='img'
        height='200'
        width='300'
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

      <CardActions>
        <Checkbox
          inputProps={{ 'aria-label': 'controlled' }}
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite />}
          checked={liked}
          onClick={handleLiked}
        />
      </CardActions>
    </StyledCard>
  )
}

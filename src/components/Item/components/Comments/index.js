import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Box } from '@mui/material'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { capitalize } from '../../../../utils/capitalize'
import { CommentForm } from './components/CommentForm'
import { Comment } from './components/Comment'

export const Comments = () => {
  const [comments, setComments] = useState([])
  const { itemId } = useParams()
  const { t } = useTranslation()

  useEffect(() => {
    getComments()
  }, [])

  const getComments = async () => {
    try {
      const response = await axios.get('/comments', {
        headers: {
          itemId: itemId,
        },
      })
      setComments(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        my: 5,
        p: 3,
      }}
    >
      {!!comments.length ? (
        <Typography
          variant='h6'
          sx={{
            marginRight: 'auto',
            my: 3,
          }}
        >
          {capitalize(`${t('comments')}`)}
        </Typography>
      ) : (
        <Box sx={{ my: 5 }}>{capitalize(`${t('no_comments')}`)}</Box>
      )}

      <CommentForm itemId={itemId} getComments={getComments} />

      {comments?.map((comment) => {
        return (
          <Comment
            key={comment._id}
            author={comment.author}
            text={comment.text}
          />
        )
      })}
    </Box>
  )
}

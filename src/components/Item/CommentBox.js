import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, TextField, Typography, Box, Paper } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import Comment from './Comment'
import { AppContext } from '../../context'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import capitalize from '../../utils/capitalize'

export default function CommentBox() {
  const [comments, setComments] = useState([])
  const [inputValue, setInputValue] = useState('')
  const appContext = useContext(AppContext)
  const { itemId } = useParams()
  const { t } = useTranslation()

  useEffect(() => {
    getComments()
  }, [])

  const handleInput = (e) => {
    setInputValue(e.target.value)
  }

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

  const sendComment = async () => {
    try {
      const response = await axios.post('/comments/add', {
        author: appContext.userData.username,
        text: inputValue,
        itemId: itemId,
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
    setInputValue('')
    getComments()
  }

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      sendComment()
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
        color: appContext.theme === 'light' ? '#4c4c4c' : '#868686',
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

      {appContext.userData && (
        <Box mt={5}>
          <TextField
            value={inputValue}
            onKeyDown={keyPress}
            onChange={handleInput}
            placeholder={`${t('add_comment')}...`}
            variant='standard'
            fullWidth
          />

          <Button
            variant='contained'
            color='inherit'
            sx={{
              my: 3,
              backgroundColor:
                appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
              color: appContext.theme === 'light' ? '#4c4c4c' : '#000000',
              '&:hover': {
                backgroundColor:
                  appContext.theme === 'light' ? '#f9f9f9' : '#868686',
              },
            }}
            endIcon={<SendIcon />}
            onClick={sendComment}
          >
            {t('send')}
          </Button>
        </Box>
      )}

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

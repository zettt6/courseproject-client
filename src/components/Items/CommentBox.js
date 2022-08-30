import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, TextField, Typography, Box } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import Comment from './Comment'
import { AppContext } from '../../context'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import capitalize from '../../utils/capitalize'

export default function CommentBox({ item, getItem }) {
  const [inputValue, setInputValue] = useState('')
  const appContext = useContext(AppContext)
  const { itemId } = useParams()
  const { t } = useTranslation()

  const handleInput = (e) => {
    setInputValue(e.target.value)
  }

  const sendComment = async () => {
    try {
      const response = await axios.put('/items/comments', {
        author: appContext.userData.username,
        text: inputValue,
        itemId: itemId,
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
    setInputValue('')
    getItem()
  }

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      sendComment()
    }
  }

  if (!item.comments) return <Box sx={{ my: 5 }}>{t('no_comments')}</Box>

  return (
    <Box
      sx={{
        width: '60vw',
        display: 'flex',
        flexDirection: 'column',
        mt: 5,
      }}
    >
      <Typography variant='h6' sx={{ marginRight: 'auto', my: 5 }}>
        {capitalize(`${t('comments')}`)}
      </Typography>
      {item.comments.map((comment) => {
        return (
          <Comment
            key={comment._id}
            author={comment.author}
            text={comment.text}
          />
        )
      })}

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
            sx={{ my: 3 }}
            endIcon={<SendIcon />}
            onClick={sendComment}
          >
            {t('send')}
          </Button>
        </Box>
      )}
    </Box>
  )
}

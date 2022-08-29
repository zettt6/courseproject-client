import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, TextField, Typography, Box } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import Comment from './Comment'
import { AppContext } from '../../context'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function CommentBox({ item, getItem }) {
  const [inputValue, setInputValue] = useState('')
  const appContext = useContext(AppContext)
  const { itemId } = useParams()

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
      console.log(response.data)
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

  if (!item.comments)
    return <Box sx={{ my: 5 }}>still no comments, add the first</Box>

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
        Comments
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
            placeholder='Add a comment...'
            variant='standard'
            fullWidth
          />

          <Button
            variant='contained'
            color='inherit'
            sx={{ width: '100px', my: 3 }}
            endIcon={<SendIcon />}
            onClick={sendComment}
          >
            Send
          </Button>
        </Box>
      )}
    </Box>
  )
}

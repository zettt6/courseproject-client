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
  const { id } = useParams()

  const handleChange = (e) => {
    setInputValue(e.target.value)
  }

  const sendComment = async () => {
    try {
      return await axios.put('/items/comments', {
        author: appContext.userData.username,
        text: inputValue,
        itemId: id,
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
    setInputValue('')
    getItem()
  }

  if (!item.comments)
    return <Box sx={{ my: 5 }}>still no comments, add the first</Box>

  return (
    <Box
      sx={{
        width: '70vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant='h6' sx={{ marginRight: 'auto' }}>
        Comments
      </Typography>
      {item.comments.map((comment) => {
        return <Comment author={comment.author} text={comment.text} />
      })}
      <TextField
        multiline
        maxRows={2}
        value={inputValue}
        onChange={handleChange}
        placeholder='Add a comment...'
        variant='standard'
        fullWidth
      />
      <Box sx={{ marginLeft: 'auto' }}>
        <Button
          variant='contained'
          color='inherit'
          sx={{ m: 1 }}
          endIcon={<SendIcon />}
          onClick={sendComment}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}

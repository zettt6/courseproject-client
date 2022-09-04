import { Box, Button, TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../../../context'
import SendIcon from '@mui/icons-material/Send'
import { useTranslation } from 'react-i18next'

export default function CommentForm({ itemId, getComments }) {
  const [inputValue, setInputValue] = useState('')
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  const sendComment = async () => {
    try {
      await axios.post('/comments/add', {
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

  const handleInput = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <div>
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
    </div>
  )
}

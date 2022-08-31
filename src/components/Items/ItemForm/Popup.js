import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import InputTag from '../InputTag'
import { AppContext } from '../../../context'
import capitalize from '../../../utils/capitalize'
import { useTranslation } from 'react-i18next'

export default function Popup({
  itemFormPopupIsOpen,
  toggleItemFormPopup,
  getItems,
  collectionId,
}) {
  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedTags, setSelectedTags] = useState('')
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  const onSubmit = async (values) => {
    try {
      await axios.post('/items', {
        title: values.title,
        creator: appContext.userData.username,
        collectionId: collectionId,
        tags: selectedTags,
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
    getItems()
    toggleItemFormPopup()
  }

  const formik = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
    }),
    onSubmit,
  })

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return
    const value = e.target.value
    if (!value.trim()) return
    setTags([...tags, value])
    e.target.value = ''
  }

  return (
    <Dialog
      open={itemFormPopupIsOpen}
      onClose={toggleItemFormPopup}
      sx={{
        width: '600px',
        height: '450px',
        margin: '0 auto',
        padding: 3,
        borderRadius: '15px',
      }}
    >
      <DialogContent>
        <TextField
          name='title'
          placeholder={`${t('title')}`}
          value={formik.values.title}
          onChange={formik.handleChange}
          sx={{ my: 2 }}
        />
        <Stack spacing={3}>
          <Autocomplete
            multiple
            freeSolo
            autoSelect
            id='tags-outlined'
            options={tags}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            onChange={(event, value) => setSelectedTags(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={`${t('add_tag')}`}
                onKeyDown={handleKeyDown}
                onChange={({ target }) => {
                  setInputValue(target.value)
                }}
                value={inputValue}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color='inherit'
          variant='outlined'
          onClick={formik.handleSubmit}
        >
          {t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

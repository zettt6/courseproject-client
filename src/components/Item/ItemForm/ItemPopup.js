import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from '@mui/material'
import React, { useContext, useMemo, useState } from 'react'
import axios from 'axios'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import InputTag from './InputTag'
import { AppContext } from '../../../context'
import { useTranslation } from 'react-i18next'
import ItemAdditionalFieldForm from './ItemAdditionalFieldForm'

export default function Popup({
  itemFormPopupIsOpen,
  toggleItemFormPopup,
  getItem,
  collectionId,
  collection,
}) {
  const [selectedTags, setSelectedTags] = useState('')
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  const onSubmit = async (values) => {
    try {
      await axios.post('/items', {
        creator: appContext.userData.username,
        collectionId: collectionId,
        tags: selectedTags,
        fields: formik.values, // ?
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }
    getItem()
    toggleItemFormPopup()
  }

  const initialValues = useMemo(() => {
    const values = {
      title: '',
    }

    collection.additionalFields?.forEach((field) => {
      values[field.name] = field.type === 'checkbox' ? false : ''
    })

    return values
  }, [collection])

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required(),
    }),
    onSubmit,
  })

  return (
    <Dialog
      open={itemFormPopupIsOpen}
      onClose={toggleItemFormPopup}
      sx={{
        margin: '0 auto',
        borderRadius: '15px',
        p: 2,
      }}
      maxWidth={'xl'}
    >
      <DialogContent sx={{ width: 'max-content' }}>
        <TextField
          name='title'
          placeholder={`${t('title')}`}
          value={formik.values.title}
          onChange={formik.handleChange}
          sx={{ my: 2 }}
          fullWidth
        />
        <ItemAdditionalFieldForm formik={formik} collection={collection} />
        <Stack spacing={3}>
          <InputTag setSelectedTags={setSelectedTags} />
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

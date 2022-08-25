import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import React, { useContext } from 'react'
import axios from 'axios'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import InputTag from '../../components/Item/InputTag'
import { AppContext } from '../../context'

export default function ItemFormPopup({
  itemFormPopupIsOpen,
  toggleItemFormPopup,
  getItems,
  collectionId,
}) {
  const appContext = useContext(AppContext)

  const onSubmit = async (values) => {
    const tags = ['tag', 'tag']

    try {
      const response = await axios.post('/items', {
        title: values.title,
        creatorId: appContext.userData._id,
        collectionId: collectionId,
        tags: tags,
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
      <DialogTitle>Create new item</DialogTitle>
      <DialogContent>
        <TextField
          name='title'
          label='Title'
          placeholder='Enter title'
          value={formik.values.title}
          onChange={formik.handleChange}
          sx={{ my: 2 }}
        />
        <InputTag />
      </DialogContent>
      <DialogActions>
        <Button
          color='inherit'
          variant='outlined'
          onClick={formik.handleSubmit}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import UploadImage from '../CollectionForm/UploadImage'
import capitalize from '../../../utils/capitalize'
import { t } from 'i18next'
import EditCollectionForm from './EditCollectionForm'
import EditCollectionSelect from './EditCollectionSelect'
import noimg from '../../../icons/noimg.svg'

export default function EditCollectionPopup({
  editMode,
  toggleEditMode,
  getCollections,
  collection,
}) {
  const [loading, setLoading] = useState(false)
  const [additionalFields, setAdditionalFields] = useState([
    ...collection.additionalFields,
  ])
  const [selectedField, setSelectedField] = useState('')

  const updateCollection = async (values, imageUrl) => {
    const token = localStorage.getItem('token')
    try {
      return axios.put(
        '/collections/update',
        {
          collectionId: collection._id,
          newTitle: values.title,
          newDescription: values.description,
          newTopic: values.topic,
          newImage: imageUrl,
          newAdditionalFields: additionalFields,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const uploadImage = async () => {
    const reqUrl = 'https://api.cloudinary.com/v1_1/dlhxpkqbh/image/upload'
    const data = new FormData()
    data.append('file', formik.values.image)
    data.append('upload_preset', 'courseproject')
    data.append('cloud_name', 'dlhxpkqbh')

    try {
      return fetch(reqUrl, {
        method: 'post',
        body: data,
      }).then((res) => res.json())
    } catch (e) {
      toast.error(e)
    }
  }

  const onSubmit = async (values) => {
    setLoading(true)
    let uploadedImage
    if (values.image) uploadedImage = await uploadImage()
    await updateCollection(values, uploadedImage?.secure_url)
    getCollections()
    setLoading(false)
    toggleEditMode()
  }

  const formik = useFormik({
    initialValues: {
      collectionId: collection._id,
      title: collection.title,
      description: collection.description,
      topic: collection.topic,
      image: collection.image,
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      description: Yup.string().required(),
      topic: Yup.string().required(),
    }),

    onSubmit,
  })

  const addFields = (e) => {
    let newField = { type: selectedField, name: '', value: '' }
    setAdditionalFields([...additionalFields, newField])
  }

  return (
    <Dialog
      open={editMode}
      onClose={toggleEditMode}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DialogTitle mx={3}>{capitalize(`${t('edit_collection')}`)}</DialogTitle>
      <DialogContent sx={{ display: 'flex' }}>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Box
            component='img'
            sx={{
              borderRadius: '10px',
              mx: 3,
            }}
            height='300px'
            width='200px'
            src={collection.image ? collection.image : noimg}
            alt='collection image'
          />
          <UploadImage formik={formik} />
        </Box>
        <Box display={'flex'} flexDirection={'column'}>
          <EditCollectionForm
            setAdditionalFields={setAdditionalFields}
            additionalFields={additionalFields}
            collection={collection}
            formik={formik}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
            addFields={addFields}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleEditMode} variant='contained'>
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          variant='contained'
          onClick={formik.handleSubmit}
        >
          {t('update')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

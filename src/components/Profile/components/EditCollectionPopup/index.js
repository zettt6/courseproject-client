import React, { useContext, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
} from '@mui/material'

import { LoadingButton } from '@mui/lab'
import axios from 'axios'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { UploadImage } from '../../../UploadImage'
import { capitalize } from '../../../../utils/capitalize'
import { AppContext } from '../../../../context'
import { t } from 'i18next'
import { EditCollectionForm } from './components/EditCollectionForm'
import noimg from '../../../../icons/noimg.svg'

export const EditCollectionPopup = ({
  editMode,
  toggleEditMode,
  getCollections,
  collection,
}) => {
  const appContext = useContext(AppContext)

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

  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
    color: appContext.theme === 'light' ? '#4c4c4c' : '#bdbbbb',
    '&:hover': {
      backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#868686',
    },
  }))

  const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
    backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
    color: appContext.theme === 'light' ? '#4c4c4c' : '#bdbbbb',
    '&:hover': {
      backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#868686',
    },
  }))

  return (
    <Dialog
      open={editMode}
      onClose={toggleEditMode}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          width: '600px',
          backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
          color: appContext.theme === 'light' ? '#4c4c4c' : '#bdbbbb',
        }}
      >
        <DialogTitle mx={3}>
          {capitalize(`${t('edit_collection')}`)}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex' }}>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Box
              component='img'
              sx={{
                borderRadius: '10px',
                mx: 3,
              }}
              height='400px'
              width='300px'
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
          <StyledButton onClick={toggleEditMode} variant='contained'>
            {t('cancel')}
          </StyledButton>
          <StyledLoadingButton
            loading={loading}
            variant='contained'
            onClick={formik.handleSubmit}
          >
            {t('update')}
          </StyledLoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

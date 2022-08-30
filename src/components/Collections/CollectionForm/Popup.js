import React, { useContext, useState } from 'react'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { AppContext } from '../../../context'

import RequiredFieldForm from './RequiredFieldForm'
import AdditionalFieldForm from './AdditionalFieldForm'
import AdditionalFieldSelect from './AdditionalFieldSelect'
import UploadImage from './UploadImage'

export default function CollectionFormPopup({
  collectionFormPopupIsOpen,
  toggleCollectionFormPopup,
  getCollections,
}) {
  const [loading, setLoading] = useState(false)
  const [selectedField, setSelectedField] = useState('')
  const [additionalField, setAdditionalField] = useState([])
  const appContext = useContext(AppContext)

  const createCollection = async (values, imageUrl) => {
    const token = localStorage.getItem('token')
    try {
      return axios.post(
        '/collections',
        {
          title: values.title,
          description: values.description,
          subject: values.subject,
          creator: appContext.userData.username,
          image: imageUrl,
          // additionalField: additionalField,
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
    await createCollection(values, uploadedImage?.secure_url)
    getCollections()
    setLoading(false)
    toggleCollectionFormPopup()
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      subject: '',
      image: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      description: Yup.string().required(),
      subject: Yup.string().required(),
      fields: Yup.array().of(
        Yup.object().shape({
          name: Yup.string(),
          number: Yup.number(),
          date: Yup.date(),
        })
      ),
    }),

    onSubmit,
  })

  const addFields = (e) => {
    let newField = { type: selectedField, name: '', value: '' }
    setAdditionalField([...additionalField, newField])
  }

  return (
    <Dialog
      open={collectionFormPopupIsOpen}
      onClose={toggleCollectionFormPopup}
      sx={{
        margin: '0 auto',
        borderRadius: '15px',
      }}
      maxWidth={'xl'}
    >
      <DialogTitle>Create new collection</DialogTitle>
      <DialogContent sx={{ width: '50vw' }}>
        <Box>
          <RequiredFieldForm formik={formik} />
          <Box
            display={'flex'}
            alignItems={'center'}
            alignContent={'center'}
            my={2}
          >
            <DialogContentText m={2}>
              You can also add additional fields for items in this collection
            </DialogContentText>
            <AdditionalFieldSelect
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              additionalField={additionalField}
            />
            {selectedField && (
              <IconButton onClick={addFields} sx={{ mx: 1 }} aria-label='add'>
                <Add />
              </IconButton>
            )}
          </Box>
          <AdditionalFieldForm
            additionalField={additionalField}
            setAdditionalField={setAdditionalField}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <UploadImage formik={formik} />
        <LoadingButton
          loading={loading}
          variant='contained'
          sx={{ width: '200px' }}
          onClick={formik.handleSubmit}
        >
          create collection
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

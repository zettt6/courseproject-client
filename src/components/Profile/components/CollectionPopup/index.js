import React, { useContext, useState } from 'react'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  styled,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { AppContext } from '../../../../context'
import { RequiredFieldForm } from './components/RequiredFieldForm'
import { CollectionAdditionalFieldsForm } from './components/CollectionAdditionalFieldsForm.js'
import { CollectionAdditionalFieldsSelect } from './components/CollectionAdditionalFieldsSelect.js'
import { UploadImage } from '../../../UploadImage'
import { capitalize } from '../../../../utils/capitalize'
import { t } from 'i18next'

export const CollectionPopup = ({
  collectionFormPopupIsOpen,
  toggleCollectionFormPopup,
  getCollections,
}) => {
  const [loading, setLoading] = useState(false)
  const [selectedField, setSelectedField] = useState('')
  const [additionalFields, setAdditionalFields] = useState([])
  const appContext = useContext(AppContext)

  const createCollection = async (values, imageUrl) => {
    const token = localStorage.getItem('token')
    try {
      return axios.post(
        '/collections',
        {
          title: values.title,
          description: values.description,
          topic: values.topic,
          creatorName: appContext.userData.username,
          image: imageUrl,
          additionalFields: additionalFields,
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
      topic: '',
      image: null,
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

  const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
    backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
    color: appContext.theme === 'light' ? '#4c4c4c' : '#bdbbbb',
    '&:hover': {
      backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#868686',
    },
  }))

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
      <Box
        sx={{
          backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
          color: appContext.theme === 'light' ? '#4c4c4c' : '#bdbbbb',
        }}
      >
        <DialogContent sx={{ width: 'max-content' }}>
          <Box>
            <RequiredFieldForm formik={formik} />
            <Box
              display={'flex'}
              alignItems={'center'}
              alignContent={'center'}
              my={2}
              p={1}
            >
              <DialogContentText mr={2}>
                {capitalize(`${t('add_additional_fields_text')}`)}
              </DialogContentText>
              <CollectionAdditionalFieldsSelect
                selectedField={selectedField}
                setSelectedField={setSelectedField}
                additionalFields={additionalFields}
              />
              {selectedField && (
                <IconButton onClick={addFields} sx={{ mx: 1 }} aria-label='add'>
                  <Add />
                </IconButton>
              )}
            </Box>
            <CollectionAdditionalFieldsForm
              additionalFields={additionalFields}
              setAdditionalFields={setAdditionalFields}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <UploadImage formik={formik} />
          <StyledLoadingButton
            loading={loading}
            variant='contained'
            onClick={formik.handleSubmit}
          >
            {t('create')}
          </StyledLoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

import { Button } from '@mui/material'
import { Box } from '@mui/system'
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridCellModes,
} from '@mui/x-data-grid'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../../context'
import Popup from './ItemForm/Popup'

export default function GridToolBar({
  selectedCellParams,
  cellMode,
  cellModesModel,
  setCellModesModel,
  collection,
  deleteItems,
  getItems,
  id,
  setLoading,
  selectedItems,
}) {
  const [itemFormPopupIsOpen, setItemFormPopupIsOpen] = useState(false)
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  const handleSaveOrEdit = () => {
    if (!selectedCellParams) {
      return
    }
    const { id, field } = selectedCellParams
    if (cellMode === 'edit') {
      setCellModesModel({
        ...cellModesModel,
        [id]: {
          ...cellModesModel[id],
          [field]: { mode: GridCellModes.View },
        },
      })
    } else {
      setCellModesModel({
        ...cellModesModel,
        [id]: {
          ...cellModesModel[id],
          [field]: { mode: GridCellModes.Edit },
        },
      })
    }
  }

  const handleCancel = () => {
    if (!selectedCellParams) {
      return
    }
    const { id, field } = selectedCellParams
    setCellModesModel({
      ...cellModesModel,
      [id]: {
        ...cellModesModel[id],
        [field]: { mode: GridCellModes.View, ignoreModifications: true },
      },
    })
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
  }

  function toggleItemFormPopup() {
    setItemFormPopupIsOpen(!itemFormPopupIsOpen)
  }

  async function deleteItems() {
    if (selectedItems.length) {
      setLoading(true)
      const token = localStorage.getItem('token')
      let queryParams = ''
      selectedItems.forEach((item) => (queryParams += `items[]=${item._id}&`))
      try {
        await axios.delete(`/items/delete?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (e) {
        toast.error(e.response.data.message)
      }
      getItems()
    }
  }

  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between', m: 1 }}>
      <Box>
        <GridToolbarFilterButton color='inherit' />
        {(appContext.userData?.username === collection?.creator ||
          appContext.userData?.role === 'ADMIN') && (
          <>
            <Button onClick={deleteItems} sx={{ mx: 1 }} color='inherit'>
              {t('delete')}
            </Button>
            <Button
              onClick={handleSaveOrEdit}
              onMouseDown={handleMouseDown}
              disabled={!selectedCellParams}
              color='inherit'
              sx={{ mx: 1 }}
            >
              {cellMode === 'edit' ? `${t('save')}` : `${t('edit')}`}
            </Button>
            <Button
              onClick={handleCancel}
              onMouseDown={handleMouseDown}
              disabled={cellMode === 'view'}
              color='inherit'
            >
              {t('cancel')}
            </Button>
          </>
        )}
      </Box>
      <Box>
        {(appContext.userData?.username === collection?.creator ||
          appContext.userData?.role === 'ADMIN') && (
          <>
            <Button
              color='inherit'
              sx={{ mx: 1 }}
              onClick={toggleItemFormPopup}
            >
              {t('create')}
            </Button>
            <Popup
              itemFormPopupIsOpen={itemFormPopupIsOpen}
              toggleItemFormPopup={toggleItemFormPopup}
              getItems={getItems}
              collectionId={id}
            />
          </>
        )}
      </Box>
    </GridToolbarContainer>
  )
}

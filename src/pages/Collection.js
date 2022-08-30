import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Button, Grid, Box } from '@mui/material'
import {
  DataGrid,
  GridCellModes,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import axios from 'axios'
import { AppContext } from '../context'
import { useNavigate, useParams } from 'react-router-dom'
import Popup from '../components/Items/ItemForm/Popup'

export default function Collection() {
  const [collection, setCollection] = useState(null)
  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [itemFormPopupIsOpen, setItemFormPopupIsOpen] = useState(false)
  const [selectedCellParams, setSelectedCellParams] = useState(null)
  const [cellModesModel, setCellModesModel] = useState({})
  const [loading, setLoading] = useState(false)
  const appContext = useContext(AppContext)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    getCollection()
    getItems()
  }, [])

  const getCollection = async () => {
    try {
      const response = await axios.get(`/collections/${id}`)
      setCollection(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const getItems = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('/items', {
        headers: {
          Authorization: `Bearer ${token}`,
          collectionId: id,
        },
      })
      setItems(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
    setLoading(false)
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

  async function updateItem(updatedRow) {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      await axios.put(
        `/items/update`,
        {
          updatedItem: updatedRow,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    } catch (e) {
      toast.error(e.response.data.message)
    }
    getItems()
  }

  const handleRowSelection = (id) => {
    const selectedIDs = new Set(id)
    const selectedRowData = items.filter((row) => selectedIDs.has(row._id))
    setSelectedItems(selectedRowData)
  }

  const columns = [
    { field: 'title', headerName: 'title', width: 200, editable: true },
    { field: 'likes', headerName: 'likes', width: 200 },
    { field: 'tags', headerName: 'tags', width: 200 },
  ]

  function toggleItemFormPopup() {
    setItemFormPopupIsOpen(!itemFormPopupIsOpen)
  }

  const goToItemPage = (row) => {
    navigate(`/collections/${id}/items/${row.id}`)
  }

  const GridToolBar = (props) => {
    const { selectedCellParams, cellMode, cellModesModel, setCellModesModel } =
      props

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

    return (
      <GridToolbarContainer sx={{ justifyContent: 'space-between', m: 1 }}>
        <Box>
          <GridToolbarFilterButton color='inherit' />
          {(appContext.userData?.username === collection?.creator ||
            appContext.userData?.role === 'ADMIN') && (
            <>
              <Button onClick={deleteItems} sx={{ mx: 1 }} color='inherit'>
                delete
              </Button>
              <Button
                onClick={handleSaveOrEdit}
                onMouseDown={handleMouseDown}
                disabled={!selectedCellParams}
                color='inherit'
                sx={{ mx: 1 }}
              >
                {cellMode === 'edit' ? 'Save' : 'Edit'}
              </Button>
              <Button
                onClick={handleCancel}
                onMouseDown={handleMouseDown}
                disabled={cellMode === 'view'}
                color='inherit'
              >
                Cancel
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
                Create new item
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

  const handleCellFocus = useCallback((event, params) => {
    const row = event.currentTarget.parentElement
    const id = row.dataset.id
    const field = event.currentTarget.dataset.field
    setSelectedCellParams({ id, field })
  }, [])

  const cellMode = useMemo(() => {
    if (!selectedCellParams) {
      return 'view'
    }
    const { id, field } = selectedCellParams
    return cellModesModel[id]?.[field]?.mode || 'view'
  }, [cellModesModel, selectedCellParams])

  const handleCellKeyDown = useCallback(
    (params, event) => {
      if (cellMode === 'edit') {
        event.defaultMuiPrevented = true
      }
    },
    [cellMode]
  )

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    updateItem(updatedRow)
    return updatedRow
  }

  return (
    <Grid ml={'20vw'}>
      <DataGrid
        onRowDoubleClick={goToItemPage}
        onSelectionModelChange={handleRowSelection}
        components={{
          Toolbar: GridToolBar,
        }}
        sx={{
          height: '60vh',
          width: '70vw',
          boxShadow: '0px 0px 12px 1px rgb(0,0,0,0.4)',
          my: 4,
        }}
        rows={items}
        getRowId={(row) => row._id}
        columns={columns}
        pageSize={10}
        checkboxSelection
        loading={loading}
        experimentalFeatures={{ newEditingApi: true }}
        componentsProps={{
          toolbar: {
            cellMode,
            selectedCellParams,
            setSelectedCellParams,
            cellModesModel,
            setCellModesModel,
          },
          cell: {
            onFocus: handleCellFocus,
          },
        }}
        onCellKeyDown={handleCellKeyDown}
        cellModesModel={cellModesModel}
        processRowUpdate={processRowUpdate}
      />
    </Grid>
  )
}

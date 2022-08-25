import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Button, Grid, IconButton } from '@mui/material'
import {
  DataGrid,
  GridCellModes,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'
import toast from 'react-hot-toast'
import axios from 'axios'
import ItemFormPopup from '../components/Item/ItemFormPopup'
import { AppContext } from '../context'
import { useNavigate, useParams } from 'react-router-dom'

export default function Collection() {
  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [itemFormPopupIsOpen, setItemFormPopupIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCellParams, setSelectedCellParams] = useState(null)
  const [cellModesModel, setCellModesModel] = useState({})
  const appContext = useContext(AppContext)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    getCollection()
    getItems()
  }, [])

  const getCollection = async () => {
    try {
      await axios.get(`/collections/${id}`)
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

  async function updateItem(updatedRow) {
    setLoading(true)
    console.log(updatedRow)
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
    navigate(`/collections/:${id}/items/${row.id}`)
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
        console.log(field)
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

    const handleMouseDown = (event) => {
      event.preventDefault()
    }

    if (!appContext.userData) return
    return (
      <GridToolbarContainer>
        <IconButton
          aria-controls='menu-appbar'
          aria-haspopup='true'
          aria-label='delete'
          color='inherit'
          onClick={deleteItems}
        >
          <DeleteOutline />
        </IconButton>
        <GridToolbarFilterButton color='inherit' />
        <Button
          onClick={handleSaveOrEdit}
          onMouseDown={handleMouseDown}
          disabled={!selectedCellParams}
          variant='outlined'
          color='inherit'
        >
          {cellMode === 'edit' ? 'Save' : 'Edit'}
        </Button>
        <Button
          onClick={handleCancel}
          onMouseDown={handleMouseDown}
          disabled={cellMode === 'view'}
          variant='outlined'
          color='inherit'
          sx={{ ml: 1 }}
        >
          Cancel
        </Button>
      </GridToolbarContainer>
    )
  }

  const handleCellFocus = useCallback((event) => {
    const row = event.currentTarget.parentElement
    const id = row.dataset.id
    const field = event.currentTarget.dataset.field
    console.log(field)
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
    <Grid align='center'>
      {appContext.userData && (
        <>
          <ItemFormPopup
            itemFormPopupIsOpen={itemFormPopupIsOpen}
            toggleItemFormPopup={toggleItemFormPopup}
            getItems={getItems}
            collectionId={id}
          />
          <Button
            color='inherit'
            variant='outlined'
            sx={{ width: '200px', m: 2 }}
            onClick={toggleItemFormPopup}
          >
            Create new item
          </Button>
        </>
      )}

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

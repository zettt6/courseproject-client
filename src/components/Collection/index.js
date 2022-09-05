import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { CircularProgress, Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import axios from 'axios'
import { AppContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { GridToolBar } from './components/GridToolBar'

export const Collection = () => {
  const [collection, setCollection] = useState([])
  const [items, setItems] = useState([])
  const [additionalFields, setAdditionalFields] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
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
    const selectedId = new Set(id)
    const selectedRowData = items.filter((row) => selectedId.has(row._id))
    setSelectedItems(selectedRowData)
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

  const goToItemPage = (row) => {
    navigate(`/collections/${id}/items/${row.id}`)
  }

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'title',
        headerName: 'title',
        width: 120,
        editable: true,
      },
      { field: 'tags', headerName: 'tags', width: 200 },
    ]

    const additionalColumns = collection?.additionalFields
      ? collection?.additionalFields
          ?.filter((f) => f.type !== 'checkbox' && f.type !== 'number')
          .map((f) => ({
            field: `additionalFields[${f.name}]`,
            headerName: f.name,
            width: 200,
            editable: true,
            valueGetter: (params) => {
              return params.getValue(params.id, 'additionalFields')[f.name]
            },
            valueSetter: (params) => {
              return {
                ...params.row,
                additionalFields: {
                  ...params.row.additionalFields,
                  [f.name]: params.value,
                },
              }
            },
          }))
      : []
    return [...baseColumns, ...additionalColumns]
  }, [collection?.additionalFields])

  return !!collection.length ? (
    <CircularProgress />
  ) : (
    <Grid ml={'20vw'}>
      <DataGrid
        onRowDoubleClick={goToItemPage}
        onSelectionModelChange={handleRowSelection}
        components={{
          Toolbar: GridToolBar,
        }}
        sx={{
          height: '70vh',
          width: '70vw',
          boxShadow: '0px 0px 12px 1px rgb(0,0,0,0.4)',
          my: 4,
          backgroundColor: appContext.theme === 'light' ? '#f9f9f9' : '#4c4c4c',
          color: appContext.theme === 'light' ? '#4c4c4c' : '#000000',
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
            additionalFields,
            setAdditionalFields,
            collection,
            getItems,
            id,
            setLoading,
            selectedItems,
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

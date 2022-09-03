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
import { AppContext } from '../context'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GridToolBar from '../components/Item/GridToolBar'

export default function Collection() {
  const [collection, setCollection] = useState([])
  const [item, setItem] = useState([])
  const [additionalFields, setAdditionalFields] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedCellParams, setSelectedCellParams] = useState(null)
  const [cellModesModel, setCellModesModel] = useState({})
  const [loading, setLoading] = useState(false)
  const appContext = useContext(AppContext)
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useTranslation()

  useEffect(() => {
    getCollection()
    getItem()
  }, [])

  const getCollection = async () => {
    try {
      const response = await axios.get(`/collections/${id}`)
      setCollection(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const getItem = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('/items', {
        headers: {
          Authorization: `Bearer ${token}`,
          collectionId: id,
        },
      })
      setItem(response.data)
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
    getItem()
  }

  const handleRowSelection = (id) => {
    const selectedIDs = new Set(id)
    const selectedRowData = item.filter((row) => selectedIDs.has(row._id))
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
        headerName: `${t('title')}`,
        width: 120,
        editable: true,
      },
      { field: 'tags', headerName: `${t('tags')}`, width: 240 },
    ]

    const additionalColumns = collection?.additionalFields
      ? collection?.additionalFields
          ?.filter((f) => f.type !== 'checkbox' && f.type !== 'number')
          .map((f) => ({
            field: `additional-${f.name}`,
            headerName: f.name,
            width: 140,
            valueGetter: (params) => {
              return params
                .getValue(params.id, 'additionalFields')
                ?.find((field) => params.field === `additional-${field.name}`)
                .value
            },
          }))
      : []

    return [...baseColumns]
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
        rows={item}
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
            getItem,
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

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
import GridToolBar from '../components/Items/GridToolBar'

export default function Collection() {
  const [collection, setCollection] = useState(null)
  const [items, setItems] = useState([])
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
    getItems()
  }, [])

  // useEffect(() => {
  //   if (collection) {
  //     setAdditionalFields(collection.additionalFields)
  //   }
  // }, [collection])

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
    const selectedIDs = new Set(id)
    const selectedRowData = items.filter((row) => selectedIDs.has(row._id))
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

  if (!collection) return <CircularProgress />

  const columns = [
    { field: 'title', headerName: `${t('title')}`, width: 200, editable: true },
    { field: 'likes', headerName: `${t('likes')}`, width: 200 },
    { field: 'tags', headerName: `${t('tags')}`, width: 200 },
    // {
    //   field: `${collection.additionalFields}`,
    //   headerName: 'additional',
    //   width: 200,
    // },
  ]

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

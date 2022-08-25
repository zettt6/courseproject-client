import React, { useContext, useEffect, useState } from 'react'
import { Button, Grid, IconButton } from '@mui/material'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
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
      console.log(response.data)
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
  }

  async function deleteItems() {
    const token = localStorage.getItem('token')

    const requests = selectedItems.map((selectedItem) => {
      try {
        return axios.delete(`/items/delete/${selectedItem._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (e) {
        toast.error(e.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getItems()
    })
  }

  async function updateItem() {
    const token = localStorage.getItem('token')

    const requests = selectedItems.map((item) => {
      try {
        return axios.put(`/items/update/${item._id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (e) {
        toast.error(e.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getItems()
    })
  }

  const handleRowSelection = (id) => {
    const selectedIDs = new Set(id)
    const selectedRowData = items.filter((row) => selectedIDs.has(row._id))
    setSelectedItems(selectedRowData)
  }

  const columns = [
    { field: 'title', headerName: 'title', width: 200 },
    { field: 'likes', headerName: 'likes', width: 200 },
    { field: 'tags', headerName: 'tags', width: 200 },
  ]

  function toggleItemFormPopup() {
    setItemFormPopupIsOpen(!itemFormPopupIsOpen)
  }

  const GridToolBar = () => {
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
      </GridToolbarContainer>
    )
  }

  const goToItemPage = (row) => {
    navigate(`/collections/:${id}/items/${row.id}`)
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
        rowsPerPageOptions={[10]}
        rows={items}
        getRowId={(row) => row._id}
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
    </Grid>
  )
}

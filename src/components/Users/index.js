import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { GridToolBar } from './components/GridToolBar'
import axios from 'axios'
import toast from 'react-hot-toast'

export const Users = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [usersData, setUsersData] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsersData(response.data)
    } catch (e) {
      toast.error(e.response.data.message)
      navigate('/')
    }
    setLoading(false)
  }

  const handleRowSelection = (id) => {
    const selectedIDs = new Set(id)
    const selectedRowData = usersData.filter((row) => selectedIDs.has(row._id))
    setSelectedUsers(selectedRowData)
  }

  const columns = [
    { field: 'username', headerName: `${t('username')}`, width: 220 },
    { field: 'email', headerName: `${t('email')}`, width: 220 },
    { field: 'status', headerName: `${t('status')}`, width: 220 },
    { field: 'role', headerName: `${t('role')}`, width: 220 },
  ]

  return (
    <Grid ml={'20vw'}>
      <DataGrid
        onSelectionModelChange={handleRowSelection}
        components={{
          Toolbar: GridToolBar,
        }}
        componentsProps={{
          toolbar: {
            selectedUsers,
            getUsers,
            setLoading,
          },
        }}
        sx={{
          height: '70vh',
          width: '70vw',
          boxShadow: '0px 0px 12px 1px rgb(0,0,0,0.4)',
          my: 4,
        }}
        rowsPerPageOptions={[10]}
        rows={usersData}
        getRowId={(row) => row._id}
        columns={columns}
        pageSize={10}
        checkboxSelection
        loading={loading}
      />
    </Grid>
  )
}

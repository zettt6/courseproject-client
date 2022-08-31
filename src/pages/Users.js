import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import toast from 'react-hot-toast'
import axios from 'axios'

import { useTranslation } from 'react-i18next'
import GridToolBar from '../components/Users/GridToolBar'

export default function Users() {
  const [usersData, setUsersData] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsersData(response.data)
    } catch (e) {
      navigate('/')
      toast.error(e.response.data.message)
    }
    setLoading(false)
  }

  const handleRowSelection = (id) => {
    const selectedIDs = new Set(id)
    const selectedRowData = usersData.filter((row) => selectedIDs.has(row._id))
    setSelectedUsers(selectedRowData)
  }

  const columns = [
    { field: 'username', headerName: `${t('username')}`, width: 200 },
    { field: 'email', headerName: `${t('email')}`, width: 200 },
    { field: 'status', headerName: `${t('status')}`, width: 200 },
    { field: 'role', headerName: `${t('role')}`, width: 200 },
  ]

  return (
    <Grid align='center'>
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
          height: '60vh',
          width: '60vw',
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

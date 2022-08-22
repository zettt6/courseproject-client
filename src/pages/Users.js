import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Grid, IconButton } from '@mui/material'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import {
  DeleteOutline,
  PersonOffOutlined,
  PersonOutline,
  StarBorderOutlined,
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function Users() {
  const [usersData, setUsersData] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const navigate = useNavigate()

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
    } catch (err) {
      navigate('/')
      toast.error(err.response.data.message)
    }
  }

  async function deleteUsers() {
    const token = localStorage.getItem('token')

    const requests = selectedUsers.map((selectedUser) => {
      try {
        return axios.delete(`/admin/users/delete/${selectedUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        toast.error(err.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getUsers()
    })
  }

  async function blockUsers() {
    console.log(1)
    const token = localStorage.getItem('token')
    const requests = selectedUsers.map((user) => {
      try {
        return axios.put(`/admin/users/block/${user._id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        toast.error(err.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getUsers()
    })
  }

  async function unblockUsers() {
    const token = localStorage.getItem('token')

    const requests = selectedUsers.map((user) => {
      try {
        return axios.put(`/admin/users/unblock/${user._id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        toast.error(err.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getUsers()
    })
  }

  async function giveAdminRights() {
    const token = localStorage.getItem('token')

    const requests = selectedUsers.map((user) => {
      try {
        return axios.put(`/admin/users/giverights/${user._id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        toast.error(err.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getUsers()
    })
  }

  async function revokeAdminRights() {
    const token = localStorage.getItem('token')

    const requests = selectedUsers.map((user) => {
      try {
        return axios.put(`/admin/users/revokerights/${user._id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        toast.error(err.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getUsers()
    })
  }

  const handleRowSelection = (id) => {
    const selectedIDs = new Set(id)
    const selectedRowData = usersData.filter((row) => selectedIDs.has(row._id))
    setSelectedUsers(selectedRowData)
  }

  const columns = [
    { field: '_id', headerName: 'ID' },
    { field: 'username', headerName: 'username', width: 200 },
    { field: 'email', headerName: 'email', width: 200 },
    { field: 'status', headerName: 'status', width: 150 },
    { field: 'role', headerName: 'role', width: 150 },
  ]

  const GridToolBar = () => {
    return (
      <GridToolbarContainer>
        <IconButton
          aria-controls='menu-appbar'
          aria-haspopup='true'
          aria-label='delete'
          color='inherit'
          onClick={deleteUsers}
        >
          <DeleteOutline />
        </IconButton>

        <IconButton
          aria-controls='menu-appbar'
          aria-haspopup='true'
          aria-label='unblock'
          color='inherit'
          onClick={blockUsers}
        >
          <PersonOffOutlined />
        </IconButton>
        <IconButton
          aria-controls='menu-appbar'
          aria-haspopup='true'
          aria-label='block'
          color='inherit'
          onClick={unblockUsers}
        >
          <PersonOutline />
        </IconButton>
        <Button color='inherit' onClick={giveAdminRights}>
          give admin rights
        </Button>
        <Button color='inherit' onClick={revokeAdminRights}>
          revoke admin rights
        </Button>
      </GridToolbarContainer>
    )
  }

  return (
    <Grid align='center'>
      <DataGrid
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
        rows={usersData}
        getRowId={(row) => row._id}
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
    </Grid>
  )
}

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Grid, IconButton, SvgIcon } from '@mui/material'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import {
  DeleteOutline,
  PersonOffOutlined,
  PersonOutline,
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import axios from 'axios'
import { ReactComponent as block } from '../icons/block.svg'
import { ReactComponent as unblock } from '../icons/unblock.svg'

export default function Users() {
  const [usersData, setUsersData] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)
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
    } catch (e) {
      navigate('/')
      toast.error(e.response.data.message)
    }
    setLoading(false)
  }

  async function deleteUsers() {
    setLoading(true)
    const token = localStorage.getItem('token')
    let queryParams = ''
    selectedUsers.forEach((user) => (queryParams += `users[]=${user._id}&`))

    try {
      await axios.delete(`/admin/users/delete?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (e) {
      toast.error(e.response.data.message)
    }

    getUsers()
  }

  async function blockUsers() {
    setLoading(true)

    const token = localStorage.getItem('token')
    try {
      await axios.put(
        `/admin/users/block`,
        {
          users: selectedUsers,
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
    getUsers()
  }

  async function unblockUsers() {
    setLoading(true)

    const token = localStorage.getItem('token')
    try {
      await axios.put(
        `/admin/users/unblock`,
        {
          users: selectedUsers,
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
    getUsers()
  }

  async function giveAdminRights() {
    setLoading(true)

    const token = localStorage.getItem('token')
    try {
      await axios.put(
        `/admin/users/give-rights`,
        {
          users: selectedUsers,
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
    getUsers()
  }

  async function revokeAdminRights() {
    setLoading(true)

    const token = localStorage.getItem('token')
    try {
      await axios.put(
        `/admin/users/revoke-rights`,
        {
          users: selectedUsers,
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
    getUsers()
  }

  const handleRowSelection = (id) => {
    const selectedIDs = new Set(id)
    const selectedRowData = usersData.filter((row) => selectedIDs.has(row._id))
    setSelectedUsers(selectedRowData)
  }

  const columns = [
    { field: 'username', headerName: 'username', width: 200 },
    { field: 'email', headerName: 'email', width: 200 },
    { field: 'status', headerName: 'status', width: 150 },
    { field: 'role', headerName: 'role', width: 150 },
  ]

  const GridToolBar = () => {
    return (
      <GridToolbarContainer>
        <SvgIcon
          component={block}
          inheritViewBox
          sx={{
            m: 1,
            cursor: 'pointer',
            ':hover': { backgroundColor: '#ebebeb82', borderRadius: '5px' },
          }}
          onClick={blockUsers}
        />
        <SvgIcon
          component={unblock}
          inheritViewBox
          sx={{
            m: 1,
            cursor: 'pointer',
            ':hover': { backgroundColor: '#ebebeb82', borderRadius: '5px' },
          }}
          onClick={unblockUsers}
        />
        <IconButton
          aria-controls='menu-appbar'
          aria-haspopup='true'
          aria-label='delete'
          color='inherit'
          onClick={deleteUsers}
        >
          <DeleteOutline />
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
        loading={loading}
      />
    </Grid>
  )
}

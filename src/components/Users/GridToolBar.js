import { DeleteOutline } from '@mui/icons-material'
import { Button, IconButton, SvgIcon } from '@mui/material'
import { GridToolbarContainer } from '@mui/x-data-grid'
import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { ReactComponent as block } from '../../icons/block.svg'
import { ReactComponent as unblock } from '../../icons/unblock.svg'

export default function GridToolBar({ selectedUsers, setLoading, getUsers }) {
  const { t } = useTranslation()

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
        {t('give_admin_rights')}
      </Button>
      <Button color='inherit' onClick={revokeAdminRights}>
        {t('revoke_admin_rights')}
      </Button>
    </GridToolbarContainer>
  )
}

import { AccountCircle, GroupOutlined, Home, Logout } from '@mui/icons-material'
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { AppContext } from '../context'
import ThemeControl from './Header/ThemeControl'

export default function Sidebar() {
  const appContext = useContext(AppContext)

  return (
    <Box>
      <Box position='fixed'>
        <List>
          <ListItem disablePadding>
            <ListItemButton component='a' href='/'>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText>Home page</ListItemText>
            </ListItemButton>
          </ListItem>
          {appContext.userData && (
            <ListItem disablePadding>
              <ListItemButton component='a' href='/profile'>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText>My collections</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
          {appContext.userData && appContext.userData.role === 'ADMIN' && (
            <ListItem disablePadding>
              <ListItemButton component='a' href='/users'>
                <ListItemIcon>
                  <GroupOutlined />
                </ListItemIcon>
                <ListItemText>Users</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
          <Divider />
          <ListItem>
            <ThemeControl />
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}

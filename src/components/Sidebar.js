import { AccountCircle, GroupOutlined, Home } from '@mui/icons-material'
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
import { useTranslation } from 'react-i18next'
import { AppContext } from '../context'
import ThemeControl from './Header/ThemeControl'
import capitalize from '../utils/capitalize'

export default function Sidebar({ isOpen, toggleDrawer }) {
  const appContext = useContext(AppContext)
  const { t } = useTranslation()

  return (
    <Box
      position='fixed'
      color={appContext.theme === 'light' ? '#4c4c4c' : '#888888'}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component='a' href='/'>
            <ListItemIcon>
              <Home sx={{ color: appContext.theme === 'dark' && '#696969' }} />
            </ListItemIcon>
            <ListItemText>{capitalize(`${t('home_page')}`)}</ListItemText>
          </ListItemButton>
        </ListItem>
        {appContext.userData && (
          <ListItem disablePadding>
            <ListItemButton component='a' href='/profile'>
              <ListItemIcon>
                <AccountCircle
                  sx={{ color: appContext.theme === 'dark' && '#696969' }}
                />
              </ListItemIcon>
              <ListItemText>
                {capitalize(`${t('my_collections')}`)}
              </ListItemText>
            </ListItemButton>
          </ListItem>
        )}
        {appContext.userData && appContext.userData.role === 'ADMIN' && (
          <ListItem disablePadding>
            <ListItemButton component='a' href='/users'>
              <ListItemIcon>
                <GroupOutlined />
              </ListItemIcon>
              <ListItemText>{capitalize(`${t('users')}`)}</ListItemText>
            </ListItemButton>
          </ListItem>
        )}
        <Divider />
        <ListItem>
          <ThemeControl />
        </ListItem>
      </List>
    </Box>
  )
}

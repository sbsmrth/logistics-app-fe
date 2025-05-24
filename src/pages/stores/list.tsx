import React, { useState } from 'react';
import { CanAccess, useNavigation, useTranslate } from '@refinedev/core';
import { CreateButton } from '@refinedev/mui';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { RefineListView, StoreTable, AllStoresMap } from '../../components';
import { SheetIcon } from '../../components/icons/sheet';
import { Unauthorized } from '../../components/unauthorized';

type View = 'table' | 'map';

export const StoreList = () => {
  const [view, setView] = useState<View>(() => {
    const view = localStorage.getItem('store-view') as View;
    return view || 'table';
  });

  const { replace, push } = useNavigation();
  const t = useTranslate();

  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    newView: View
  ) => {
    // remove query params (pagination, filters, etc.) when changing view
    replace('');

    setView(newView);
    localStorage.setItem('store-view', newView);
  };

  return (
    <CanAccess resource="stores" action="list" fallback={<Unauthorized />}>
      <RefineListView
        headerButtons={props => [
          <ToggleButtonGroup
            key="view-toggle"
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="text alignment"
          >
            <ToggleButton value="table" aria-label="table view" size="small">
              <ListOutlinedIcon />
            </ToggleButton>
            <ToggleButton value="map" aria-label="map view" size="small">
              <PlaceOutlinedIcon />
            </ToggleButton>
          </ToggleButtonGroup>,
          <CreateButton
            {...props.createButtonProps}
            key="create"
            size="medium"
            sx={{ height: '40px' }}
          >
            {t('stores.addNewStore')}
          </CreateButton>,
          <CreateButton
            {...props.createButtonProps}
            key="upload"
            size="medium"
            sx={{ height: '40px' }}
            color="secondary"
            startIcon={<SheetIcon />}
            onClick={() => push('/stores/upload')}
          >
            {t('stores.uploadStore')}
          </CreateButton>,
        ]}
      >
        {view === 'table' && <StoreTable />}
        {view === 'map' && (
          <Box sx={{ height: 'calc(100dvh - 232px)', marginTop: '32px' }}>
            <AllStoresMap />
          </Box>
        )}
      </RefineListView>
    </CanAccess>
  );
};

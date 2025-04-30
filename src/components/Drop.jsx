import { Box, Grid, List, ListItem, Typography } from '@mui/material';
import React, { useState, useRef } from 'react';

export const Drop = () => {
  const [lists, setLists] = useState([
    {
      id: 'list 1',
      title: 'List 1',
      backgroundColor: 'red',
      items: ['item 1', 'item 2', 'item 3', 'item 4'],
    },
    {
      id: 'list 2',
      title: 'List 2',
      backgroundColor: 'green',
      items: ['item 5', 'item 6', 'item 7', 'item 8'],
    },
    {
      id: 'list 3',
      title: 'List 3',
      backgroundColor: '#b09604',
      items: ['item 9', 'item 10', 'item 11', 'item 12'],
    },
  ]);

  const dragItem = useRef(null);
  const dragContainerId = useRef(null);

  const handleDragStart = (event, item, containerId) => {
    dragItem.current = item;
    dragContainerId.current = containerId;
  };

  const handleDrop = (event, targetList) => {
    if (dragItem.current && dragContainerId.current) {
      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === dragContainerId.current) {
            return { ...list, items: list.items.filter((item) => item !== dragItem.current) };
          }
          if (list.id === targetList.id) {
            return { ...list, items: [...list.items, dragItem.current] };
          }
          return list;
        })
      );
      dragItem.current = null;
      dragContainerId.current = null;
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ backgroundColor: 'grey', minHeight: '100vh', padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h4">Drag & Drop</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={2}>
          {lists.map((list) => (
            <Grid
              item
              xs={12}
              md={4}
              key={list.id}
              sx={{
                border: '2px solid white',
                backgroundColor: list.backgroundColor,
                borderRadius: '8px',
                padding: 2,
                color: 'white',
              }}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, list)}
            >
              <Typography sx={{ textAlign: 'center', mb: 1 }}>{list.title}</Typography>
              <List>
                {list.items.map((item, index) => (
                  <ListItem
                    key={index}
                    draggable="true"
                    onDragStart={(event) => handleDragStart(event, item, list.id)}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      marginBottom: '5px',
                      padding: '8px',
                      cursor: 'grab',
                    }}
                  >
                    {item}
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
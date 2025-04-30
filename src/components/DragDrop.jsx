import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export const DragDrop = () => {
  const initialItems = ["Item 1", "Item 2", "Item 3", "Item 4"];
  const middleItems = ["Item 5", "Item 6", "Item 7", "Item 8"];
  const finalItems = ["Item 9", "Item 10", "Item 11", "Item 12"];

  const [list1, setList1] = useState([...initialItems]);
  const [list2, setList2] = useState([...middleItems]);
  const [list3, setList3] = useState([...finalItems]);
  
  // State for custom lists
  const [customLists, setCustomLists] = useState([]);
  
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedList, setDraggedList] = useState(null);
  const [listPositions, setListPositions] = useState([1, 2, 3]);

  const [open, setOpen] = useState(false);
  const [internalItem, setInternalItem] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newItem, setNewItem] = useState('');
  const [CustomListIndex, setCustomListIndex] = useState(0);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (
      !draggedList ||
      dragItem.current === null ||
      dragOverItem.current === null
    )
      return;

    // Handle default lists
    const lists = { 1: [...list1], 2: [...list2], 3: [...list3] };
    const setLists = { 1: setList1, 2: setList2, 3: setList3 };

    // Handle custom lists
    if (typeof draggedList === 'string' && draggedList.startsWith('custom')) {
      const customListIndex = parseInt(draggedList.split('-')[1]);
      const updatedCustomLists = [...customLists];
      const customListItems = [...updatedCustomLists[customListIndex].items];
      
      const dragItemValue = customListItems[dragItem.current];
      customListItems.splice(dragItem.current, 1);
      customListItems.splice(dragOverItem.current, 0, dragItemValue);
      
      updatedCustomLists[customListIndex].items = customListItems;
      setCustomLists(updatedCustomLists);
    } else {
      // Handle default lists
      const newList = lists[draggedList];
      const dragItemValue = newList[dragItem.current];

      newList.splice(dragItem.current, 1);
      newList.splice(dragOverItem.current, 0, dragItemValue);

      setLists[draggedList](newList);
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleItemDragStart = (item, e, index, listId) => {
    setDraggedItem(item);
    setDraggedList(listId);
    dragItem.current = index;
    e.dataTransfer.setData("text/plain", index);
    e.stopPropagation();
  };

  const handleListDragStart = (listId) => {
    setDraggedItem(null); 
    setDraggedList(listId);
  };

  const handleItemDrop = (targetListId) => {
    if (draggedItem && draggedList !== targetListId) {
      // Handle default lists
      const allLists = { 1: list1, 2: list2, 3: list3 };
      const setAllLists = { 1: setList1, 2: setList2, 3: setList3, };

      // Handle when dropping to default list
      if (targetListId === 1 || targetListId === 2 || targetListId === 3 ) {
        // Remove from source list
        if (typeof draggedList === 'string' && draggedList.startsWith('custom')) {
          // Remove from custom list
          const customListIndex = parseInt(draggedList.split('-')[1]);
          const updatedCustomLists = [...customLists];
          updatedCustomLists[customListIndex].items = updatedCustomLists[customListIndex].items.filter(
            item => item !== draggedItem
          );
          setCustomLists(updatedCustomLists);
        } else {
          // Remove from default list
          Object.keys(allLists).forEach((key) => {
            if (parseInt(key) !== targetListId) {
              setAllLists[key](allLists[key].filter((i) => i !== draggedItem));
            }
          });
        }
        
        // Add to target list
        setAllLists[targetListId]([...allLists[targetListId], draggedItem]);
      } 
      // Handle when dropping to custom list
      else if (typeof targetListId === 'string' && targetListId.startsWith('custom')) {
        const customListIndex = parseInt(targetListId.split('-')[1]);
        const updatedCustomLists = [...customLists];
        
        // Remove from source list
        if (typeof draggedList === 'string' && draggedList.startsWith('custom')) {
          // Remove from custom list
          const sourceListIndex = parseInt(draggedList.split('-')[1]);
          updatedCustomLists[sourceListIndex].items = updatedCustomLists[sourceListIndex].items.filter(
            item => item !== draggedItem
          );
        } else {
          // Remove from default list
          setAllLists[draggedList](allLists[draggedList].filter((i) => i !== draggedItem));
        }
        
        // Add to target custom list
        updatedCustomLists[customListIndex].items.push(draggedItem);
        setCustomLists(updatedCustomLists);
      }
      
      setDraggedItem(null);
    }
  };

  const handleListDrop = (targetListId) => {
    if (!draggedItem && draggedList && draggedList !== targetListId) {
      // For now, we'll just handle default lists swapping
      // Custom list swapping can be added with more complex logic
      if (
        (typeof draggedList === 'number' || !isNaN(parseInt(draggedList))) && 
        (typeof targetListId === 'number' || !isNaN(parseInt(targetListId)))
      ) {
        const sourceIndex = listPositions.indexOf(parseInt(draggedList));
        const targetIndex = listPositions.indexOf(parseInt(targetListId));

        if (sourceIndex !== -1 && targetIndex !== -1) {
          const newPositions = [...listPositions];
          newPositions[sourceIndex] = parseInt(targetListId);
          newPositions[targetIndex] = parseInt(draggedList);

          setListPositions(newPositions);
        }
      }
      setDraggedList(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getListItems = (listId) => {
    if (listId === 1) return list1;
    if (listId === 2) return list2;
    if (listId === 3) return list3;
    if (typeof listId === 'string' && listId.startsWith('custom')) {
      const customListIndex = parseInt(listId.split('-')[1]);
      return customLists[customListIndex]?.items || [];
    }
    return [];
  };

  const getColor = (listId) => {
    if (listId === 1) return "#EBECF0";
    if (listId === 2) return "#2e7d32";
    if (listId === 3) return "#b09604";
    return "#607D8B"; 
  };

  const handleClick = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setNewListTitle("");
    setInternalItem(false);
  };
  
  const addNewList = () => {
   
      const newCustomList = {
        id: "custom",
        title: newListTitle,
        items: []
      };
      
      setCustomLists([...customLists, newCustomList]);
      setOpen(false);
      setNewListTitle("");
    
  };  

  const handleItem = (index) => {
    setCustomListIndex(index);
    setInternalItem(true);
    setNewItem("");
  };

  const addNewItem = () => {
    
      const updatedCustomLists = [...customLists];
      updatedCustomLists[CustomListIndex].items.push(newItem);
      
      setCustomLists(updatedCustomLists);
      setInternalItem(false);
      setNewItem("");
    
  };



  const handleInputChange = (event) => {
    setNewItem(event.target.value);
  };

 

  return (
    <Box sx={{ backgroundColor: "#00B2D2", height: "100%", minHeight: "100vh", color: "white", pb: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography sx={{ marginTop: "10px" }} variant="h4">
          Drag and Drop
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        <Button
          onClick={handleClick}
         variant="contained" color="error" size="large"
        >
          Add New List
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New List</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              placeholder="Please add a Title"
              variant="outlined"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "red" }}>
              Cancel
            </Button>
            <Button
              onClick={addNewList}
              sx={{ backgroundColor: "blue", color: "white" }}
              autoFocus
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 5,
        }}>
        
        <Grid container spacing={3} sx={{ maxWidth: "1200px" }}>
          {/* Default lists */}
          {[0, 1, 2].map((positionIndex) => {
            const listId = listPositions[positionIndex];
            return (
              <Grid
                key={`default-${listId}`}
                item 
                xs={12}
                sm={6}
                md={4}
                sx={{
                  border: "2px solid white",
                  backgroundColor:" #EBECF0",
                  color:"black",
                  borderRadius: "8px",
                  padding: 2,
                  minHeight: "300px",
                  cursor: "grab",
                 
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  e.preventDefault();
                
                  if (draggedItem) {
                    handleItemDrop(listId);
                  } else {
                    handleListDrop(listId);
                  }
                }}
                draggable
                onDragStart={() => handleListDragStart(listId)}
              >
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  List {listId}
                </Typography>
                <List>
                  {getListItems(listId).map((item, index) => (
                    <ListItem
                      key={index}
                      draggable
                      onDragStart={(e) =>
                        handleItemDragStart(item, e, index, listId)
                      }
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragEnd={handleDragEnd}
                      sx={{
                        color: "black",
                        marginBottom: 1,
                        borderRadius: "4px",
                        cursor: "pointer",
                        width:"100%"
                      }}
                    >
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            );
          })}
          


          {/* Custom lists */}
          {customLists.map((customList, index) => (
            <Grid
              key={customList.id}
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                border: "2px solid white",
                backgroundColor: "#EBECF0",
                borderRadius: "8px",
                padding: 2,
                minHeight: "300px",
                cursor: "grab",
                color:"black",
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.preventDefault();
                
                if (draggedItem) {
                  handleItemDrop(customList.id);
                } else {
                  handleListDrop(customList.id);
                }
              }}
              draggable
              onDragStart={() => handleListDragStart(customList.id)}
            >
              <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
                {customList.title}
              </Typography>

              <Button 
                size="small" 
                variant="contained" 
               
                onClick={() => handleItem(index)}
                sx={{ mb: 1, backgroundColor:"transparent", color:"black", }}>
                Add Item
              </Button>

              <List>
                {customList.items.map((item, itemIndex) => (
                  <ListItem
                    key={itemIndex}
                    draggable
                    onDragStart={(e) =>
                      handleItemDragStart(item, e, itemIndex, customList.id)
                    }
                    onDragEnter={(e) => handleDragEnter(e, itemIndex)}
                    onDragEnd={handleDragEnd}
                    sx={{
                      color: "black",
                      marginBottom: 1,
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialog for adding new items */}
      <Dialog open={internalItem} onClose={handleClose}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            value={newItem}
            onChange={handleInputChange}
            margin="dense"
            fullWidth
            placeholder="Please add an Item"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "red" }}>
            Cancel
          </Button>
          <Button
            onClick={addNewItem}
            sx={{ backgroundColor: "blue", color: "white" }}
            autoFocus
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
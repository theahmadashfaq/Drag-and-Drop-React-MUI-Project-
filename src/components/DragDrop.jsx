import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import style from "../components/styles";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from '@mui/icons-material/Add';

export const DragDrop = () => {
  const initialItems = ["Item 1", "Item 2", "Item 3", "Item 4"];
  const middleItems = ["Item 5", "Item 6", "Item 7", "Item 8"];
  const finalItems = ["Item 9", "Item 10", "Item 11", "Item 12"];

  const [list1, setList1] = useState([...initialItems]);
  const [list2, setList2] = useState([...middleItems]);
  const [list3, setList3] = useState([...finalItems]);

  // State for custom lists
  const [customLists, setCustomLists] = useState([]);
  const customListCounter = useRef(0); // Ref to generate unique IDs for custom lists

  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedListId, setDraggedListId] = useState(null);
  const [listPositions, setListPositions] = useState([1, 2, 3]);

  const [openNewListDialog, setOpenNewListDialog] = useState(false);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [openEditListDialog, setOpenEditListDialog] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [currentCustomListIndex, setCurrentCustomListIndex] = useState(null);
  const [editingListTitle, setEditingListTitle] = useState("");
  const [editListIndex, setEditListIndex] = useState(null); // New state for tracking which list is being edited

  // Menu state for lists
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeListIndex, setActiveListIndex] = useState(null);
  const openMenu = Boolean(menuAnchorEl);

  // Menu state for items
  const [itemMenuAnchorEl, setItemMenuAnchorEl] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [activeItemListId, setActiveItemListId] = useState(null);
  const openItemMenu = Boolean(itemMenuAnchorEl);

  // State for editing items
  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
  const [editingItemText, setEditingItemText] = useState("");
  const [editingItemListId, setEditingItemListId] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null);

  // State for deleting items
  const [openDeleteItemConfirmDialog, setOpenDeleteItemConfirmDialog] = useState(false);
  const [deleteItemListId, setDeleteItemListId] = useState(null);
  const [deleteItemIndex, setDeleteItemIndex] = useState(null);

  const dragItemIndex = useRef(null);
  const dragOverItemIndex = useRef(null);

  const handleDragEnter = (e, index) => {
    dragOverItemIndex.current = index;
  };

  const handleDragEnd = () => { 
    if (
      !draggedListId ||
      dragItemIndex.current === null ||
      dragOverItemIndex.current === null
    ) {
      return;
    }

    if (
      typeof draggedListId === "string" &&
      draggedListId.startsWith("custom")
    ) {
      const customListIndex = parseInt(draggedListId.split("-")[1]);
      const updatedCustomLists = [...customLists];
      const customListItems = [...updatedCustomLists[customListIndex].items];

      const [draggedItemValue] = customListItems.splice(
        dragItemIndex.current,
        1
      );
      customListItems.splice(dragOverItemIndex.current, 0, draggedItemValue);

      updatedCustomLists[customListIndex].items = customListItems;
      setCustomLists(updatedCustomLists);
    } else if (typeof draggedListId === "number") {
      const lists = { 1: [...list1], 2: [...list2], 3: [...list3] };
      const setLists = { 1: setList1, 2: setList2, 3: setList3 };
      const newList = lists[draggedListId];
      const [draggedItemValue] = newList.splice(dragItemIndex.current, 1);
      newList.splice(dragOverItemIndex.current, 0, draggedItemValue);
      setLists[draggedListId](newList);
    }

    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  const handleItemDragStart = (item, e, index, listId) => {
    setDraggedItem(item);
    setDraggedListId(listId);
    dragItemIndex.current = index;
    e.dataTransfer.setData("text/plain", index);
    e.stopPropagation();
  };

  const handleListDragStart = (listId) => {
    setDraggedItem(null);
    setDraggedListId(listId);
  };

  const handleItemDrop = (targetListId) => {
    if (draggedItem && draggedListId !== targetListId) {
      const allLists = { 1: list1, 2: list2, 3: list3 };
      const setAllLists = { 1: setList1, 2: setList2, 3: setList3 };

      // Dropping to a default list
      if (typeof targetListId === "number") {
        // Remove from source
        if (
          typeof draggedListId === "string" &&
          draggedListId.startsWith("custom")
        ) {
          const customListIndex = parseInt(draggedListId.split("-")[1]);
          const updatedCustomLists = [...customLists];
          updatedCustomLists[customListIndex].items = updatedCustomLists[
            customListIndex
          ].items.filter((item) => item !== draggedItem);
          setCustomLists(updatedCustomLists);
        } else if (typeof draggedListId === "number") {
          setAllLists[draggedListId](
            allLists[draggedListId].filter((i) => i !== draggedItem)
          );
        }
        // Add to target
        setAllLists[targetListId]([...allLists[targetListId], draggedItem]);
      }
      // Dropping to a custom list
      else if (
        typeof targetListId === "string" &&
        targetListId.startsWith("custom")
      ) {
        const targetCustomListIndex = parseInt(targetListId.split("-")[1]);
        const updatedCustomLists = [...customLists];

        // Remove from source
        if (
          typeof draggedListId === "string" &&
          draggedListId.startsWith("custom")
        ) {
          const sourceCustomListIndex = parseInt(draggedListId.split("-")[1]);
          updatedCustomLists[sourceCustomListIndex].items = updatedCustomLists[
            sourceCustomListIndex
          ].items.filter((item) => item !== draggedItem);
        } else if (typeof draggedListId === "number") {
          setAllLists[draggedListId](
            allLists[draggedListId].filter((i) => i !== draggedItem)
          );
        }
        // Add to target
        updatedCustomLists[targetCustomListIndex].items.push(draggedItem);
        setCustomLists(updatedCustomLists);
      }
      setDraggedItem(null);
    }
  };

  const handleListDrop = (targetListId) => {
    if (!draggedItem && draggedListId && draggedListId !== targetListId) {
      const isDraggedDefault = typeof draggedListId === "number";
      const isTargetDefault = typeof targetListId === "number";
      const isDraggedCustom =
        typeof draggedListId === "string" && draggedListId.startsWith("custom");
      const isTargetCustom =
        typeof targetListId === "string" && targetListId.startsWith("custom");

      if (isDraggedDefault && isTargetDefault) {
        const sourceIndex = listPositions.indexOf(parseInt(draggedListId));
        const targetIndex = listPositions.indexOf(parseInt(targetListId));
        if (sourceIndex !== -1 && targetIndex !== -1) {
          const newPositions = [...listPositions];
          newPositions[sourceIndex] = parseInt(targetListId);
          newPositions[targetIndex] = parseInt(draggedListId);
          setListPositions(newPositions);
        }
      } else if (isDraggedCustom && isTargetCustom) {
        const draggedIndex = customLists.findIndex(
          (list) => list.id === draggedListId
        );
        const targetIndex = customLists.findIndex(
          (list) => list.id === targetListId
        );
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const updatedCustomLists = [...customLists];
          const [draggedListObject] = updatedCustomLists.splice(
            draggedIndex,
            1
          );
          updatedCustomLists.splice(targetIndex, 0, draggedListObject);
          setCustomLists(updatedCustomLists);
        }
      }

      setDraggedListId(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleOpenNewListDialog = () => {
    setOpenNewListDialog(true);
  };

  const handleCloseNewListDialog = () => {
    setOpenNewListDialog(false);
    setNewListTitle("");
  };

  const handleAddNewList = () => {
    const newCustomList = {
      id: `custom-${customListCounter.current++}`,
      title: newListTitle,
      items: [],
    };
    setCustomLists([...customLists, newCustomList]);
    handleCloseNewListDialog();
  };

  const handleOpenAddItemDialog = (index) => {
    setCurrentCustomListIndex(index);
    setNewItemText("");
    setOpenAddItemDialog(true);
  };

  const handleCloseAddItemDialog = () => {
    setOpenAddItemDialog(false);
    setNewItemText("");
    setCurrentCustomListIndex(null);
  };

  const handleAddNewItem = () => {
    if (currentCustomListIndex !== null) {
      const updatedCustomLists = [...customLists];
      updatedCustomLists[currentCustomListIndex].items.push(newItemText);
      setCustomLists(updatedCustomLists);
      handleCloseAddItemDialog();
    }
  };

  const handleNewItemInputChange = (event) => {
    setNewItemText(event.target.value);
  };

  // List Menu handlers
  const handleMenuOpen = (event, index) => {
    event.stopPropagation(); 
    setMenuAnchorEl(event.currentTarget);
    setActiveListIndex(index);
  };


  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveListIndex(null);
  };

  // Item Menu handlers
  const handleItemMenuOpen = (event, listId, itemIndex) => {
    event.stopPropagation();
    event.preventDefault(); // Prevent dragging when clicking on menu
    setItemMenuAnchorEl(event.currentTarget);
    setActiveItemListId(listId);
    setActiveItemIndex(itemIndex);
  };

  const handleItemMenuClose = () => {
    setItemMenuAnchorEl(null);
    setActiveItemListId(null);
    setActiveItemIndex(null);
  };

  // Delete list handlers
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [listToDeleteIndex, setListToDeleteIndex] = useState(null);

  const handleOpenDeleteConfirm = () => {
    setListToDeleteIndex(activeListIndex);
    setOpenDeleteConfirmDialog(true);
    handleMenuClose();
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirmDialog(false);
    setListToDeleteIndex(null);
  };

  const handleDeleteList = () => {
    if (listToDeleteIndex !== null) {
      const updatedCustomLists = [...customLists];
      updatedCustomLists.splice(listToDeleteIndex, 1);
      setCustomLists(updatedCustomLists);
      handleCloseDeleteConfirm();
    }
  };

  // Edit list handlers
  const handleOpenEditDialog = () => {
    if (activeListIndex !== null) {
      setEditingListTitle(customLists[activeListIndex].title);
      setEditListIndex(activeListIndex);
      setOpenEditListDialog(true);
      handleMenuClose();
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditListDialog(false);
    setEditingListTitle("");
    setEditListIndex(null);
  };

  const handleSaveEditList = () => {
    if (editListIndex !== null && editingListTitle.trim() !== "") {  
      const updatedCustomLists = [...customLists];
      updatedCustomLists[editListIndex].title = editingListTitle;
      setCustomLists(updatedCustomLists);
      handleCloseEditDialog();
    } 
  };

  // Edit item handlers
  const handleOpenEditItemDialog = () => {
    if (activeItemListId !== null && activeItemIndex !== null) {
      let currentItemText = "";
      
      if (typeof activeItemListId === "string" && activeItemListId.startsWith("custom")) {
        const customListIndex = parseInt(activeItemListId.split("-")[1]);
        currentItemText = customLists[customListIndex].items[activeItemIndex];
      } else if (typeof activeItemListId === "number") {
        const lists = { 1: list1, 2: list2, 3: list3 };
        currentItemText = lists[activeItemListId][activeItemIndex];
      }
      
      setEditingItemText(currentItemText);
      setEditingItemListId(activeItemListId); // Store list ID for when dialog closes
      setEditingItemIndex(activeItemIndex); // Store item index for when dialog closes
      setOpenEditItemDialog(true);
      handleItemMenuClose();
    }
  };

  const handleCloseEditItemDialog = () => {
    setOpenEditItemDialog(false);
    setEditingItemText("");
    setEditingItemListId(null);
    setEditingItemIndex(null);
  };

  const handleSaveEditItem = () => {
    if (editingItemListId !== null && editingItemIndex !== null && editingItemText.trim() !== "") {
      if (typeof editingItemListId === "string" && editingItemListId.startsWith("custom")) {
        const customListIndex = parseInt(editingItemListId.split("-")[1]);
        const updatedCustomLists = [...customLists];
        updatedCustomLists[customListIndex].items[editingItemIndex] = editingItemText;
        setCustomLists(updatedCustomLists);
      } else if (typeof editingItemListId === "number") {
        const lists = { 1: [...list1], 2: [...list2], 3: [...list3] };
        const setLists = { 1: setList1, 2: setList2, 3: setList3 };
        lists[editingItemListId][editingItemIndex] = editingItemText;
        setLists[editingItemListId](lists[editingItemListId]);
      }
      
      handleCloseEditItemDialog();
    }
  };

  // Delete item handlers
  const handleOpenDeleteItemConfirm = () => {
    setDeleteItemListId(activeItemListId); // Store list ID for when dialog closes
    setDeleteItemIndex(activeItemIndex); // Store item index for when dialog closes
    setOpenDeleteItemConfirmDialog(true);
    handleItemMenuClose();
  };

  const handleCloseDeleteItemConfirm = () => {
    setOpenDeleteItemConfirmDialog(false);
    setDeleteItemListId(null);
    setDeleteItemIndex(null);
  };

  const handleDeleteItem = () => {
    if (deleteItemListId !== null && deleteItemIndex !== null) {
      if (typeof deleteItemListId === "string" && deleteItemListId.startsWith("custom"))
      {
        const customListIndex = parseInt(deleteItemListId.split("-")[1]);
        const updatedCustomLists = [...customLists];
        updatedCustomLists[customListIndex].items.splice(deleteItemIndex, 1);
        setCustomLists(updatedCustomLists);
      }
      else if (typeof deleteItemListId === "number") 
      {
        const lists = { 1: [...list1], 2: [...list2], 3: [...list3] };
        const setLists = { 1: setList1, 2: setList2, 3: setList3 };
        lists[deleteItemListId].splice(deleteItemIndex, 1);
        setLists[deleteItemListId](lists[deleteItemListId]);
      }
      
      handleCloseDeleteItemConfirm();
    }
  }; 

  const getListItems = (listId) => {
    if (listId === 1) return list1;
    if (listId === 2) return list2;
    if (listId === 3) return list3;
    if (typeof listId === "string" && listId.startsWith("custom")) {
      const customListIndex = parseInt(listId.split("-")[1]);
      return customLists[customListIndex]?.items || [];
    }
    return [];
  };

  return (
    <Box sx={style.box}>
      <Box sx={style.headerContainer}>
        <Typography sx={style.titleTypography} variant="h4">
          Drag and Drop
        </Typography>
        <Button
          onClick={handleOpenNewListDialog}
          variant="contained"
          color="error"
          size="large"
        >
          Add List
        </Button>

        <Dialog open={openNewListDialog} onClose={handleCloseNewListDialog}>
          <DialogTitle>Add Title of a New List</DialogTitle>
          <DialogContent>
            <TextField
              
              margin="dense"
              fullWidth
              placeholder="Please add a Title"
              variant="outlined"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewListDialog} sx={style.CANCELColor}>
              CANCEL
            </Button>
            <Button onClick={handleAddNewList} sx={style.addColor} >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Horizontal scrolling container for lists */}
      <Box sx={style.horizontalScrollContainer}>
        {/* Custom lists */}
        {customLists.map((customList, index) => (
          <Box
            key={customList.id}
            sx={{
              ...style.customListBox,
              height: customList.items.length > 0 ? "auto" : 160,
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
            <Typography variant="h6" sx={style.listTitleTypography}>
              {customList.title}
              <IconButton
                sx={style.listMenuButton}
                onClick={(e) => handleMenuOpen(e, index)}
                aria-label="more"
                aria-controls="list-menu"
                aria-haspopup="true"
              >
                <MoreHorizIcon />
              </IconButton>
            </Typography>

            <List sx={style.listContainer}>
              {customList.items.map((item, itemIndex) => (
                <ListItem
                  key={itemIndex}
                  draggable
                  onDragStart={(e) =>
                    handleItemDragStart(item, e, itemIndex, customList.id)
                  }
                  onDragEnter={(e) => handleDragEnter(e, itemIndex)}
                  onDragEnd={handleDragEnd}
                  sx={style.listItem}
                >
                  <ListItemText primary={item} />
                  <IconButton
                    size="small"
                    sx={style.itemMenuButton}
                    onClick={(e) => handleItemMenuOpen(e, customList.id, itemIndex)}
                    aria-label="item options"
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
           
           
            <Button
              size="small"
              variant="contained"
              onClick={() => handleOpenAddItemDialog(index)}
              sx={style.addItemButton}
            >
               <IconButton><AddIcon/></IconButton>
             Add Item
            </Button>
            
            
          </Box>
        ))}
      </Box>

      {/* Menu for list options */}
      <Menu
        id="list-menu"
        anchorEl={menuAnchorEl}
        open={openMenu}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenEditDialog} sx={style.edit}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteConfirm} sx={style.delete}>
          Delete
        </MenuItem>
      </Menu>

      {/* Menu for item options */}
      <Menu
        id="item-menu"
        anchorEl={itemMenuAnchorEl}
        open={openItemMenu}
        onClose={handleItemMenuClose}
      >
        <MenuItem onClick={handleOpenEditItemDialog} sx={style.edit}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteItemConfirm} sx={style.delete}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete List Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirmDialog}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this list?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} sx={style.CANCELColor}>
            CANCEL
          </Button>
          <Button onClick={handleDeleteList} color="error" >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Item Confirmation Dialog */}
      <Dialog
        open={openDeleteItemConfirmDialog}
        onClose={handleCloseDeleteItemConfirm}
        aria-labelledby="delete-item-confirmation-dialog"
      >
        <DialogTitle id="delete-item-confirmation-dialog">
          Confirm Delete Item
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteItemConfirm} sx={style.CANCELColor}>
            CANCEL
          </Button>
          <Button onClick={handleDeleteItem} color="error" >
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding new items to custom list */}
      <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            
            value={newItemText}
            onChange={handleNewItemInputChange}
            margin="dense"
            fullWidth
            placeholder="Please add an Item"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddItemDialog} sx={style.CANCELColor}>
            CANCEL
          </Button>
          <Button onClick={handleAddNewItem} sx={style.addColor} >
            ADD
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing list title */}
      <Dialog 
        open={openEditListDialog} 
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit List Title</DialogTitle>
        <DialogContent>
          <TextField
            
            margin="dense"
            fullWidth
            label="List Title"
            placeholder="Enter list title"
            variant="outlined"
            value={editingListTitle}
            onChange={(e) => setEditingListTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} sx={style.CANCELColor}>
            CANCEL
          </Button>
          <Button 
            onClick={handleSaveEditList} 
            sx={style.addColor} 
            
            disabled={!editingListTitle.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing item text */}
      <Dialog 
        open={openEditItemDialog} 
        onClose={handleCloseEditItemDialog}
        fullWidth
        maxWidth="sm">
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            
            margin="dense"
            fullWidth
            label="Item Text"
            placeholder="Enter item text"
            variant="outlined" 
            value={editingItemText}
            onChange={(e) => setEditingItemText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditItemDialog} sx={style.CANCELColor}>
            CANCEL
          </Button>
          <Button 
            onClick={handleSaveEditItem} 
            sx={style.addColor} 
            
            disabled={!editingItemText.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box> 
  );
};
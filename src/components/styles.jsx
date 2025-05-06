const styles = {
  box: {
    backgroundColor: "#00B2D2",
    height: "100%",
    minHeight: "100vh",
    color: "white",
    paddingBottom: "5px",
  },
line:{
  textAlign:"center", marginTop:"150px", color:"black" 
},


line1:{
  fontSize:"3rem",
  
},

  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
   
  },

  titleTypography: {
    margin: 0,
  },

  cancelColor: { color: "red" },
  addColor: { backgroundColor: "blue", color: "white" },

  // Horizontal
  horizontalScrollContainer: {
    display: "flex",
    overflowX: "auto",
    padding: "20px",
    gap: "16px",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  customListBox: {
    flexShrink: 0,
    width: "350px",
    maxHeight: "500px",
    border: "2px solid white",
    backgroundColor: "#EBECF0",
    borderRadius: "8px",
    padding: "16px",
    cursor: "grab",
    color: "black",
    display: "flex",
    flexDirection: "column",
  },

  listContainer: {
    flexGrow: 1,
    padding: 0,
  },

  listTitleTypography: {
    marginBottom: "12px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  delete: { color: "red" },

  edit: { color: "blue" },

  
  listMenuButton: {
    marginLeft: "auto",
  },

  itemMenuButton: {
    marginLeft: "8px",
  },

  listItem: {
    color: "black",
    marginBottom: "8px",
    backgroundColor: "white",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
    height: "auto", 
    minHeight: "100px", 
  },

  addItemButton: {
    marginTop: "8px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    height: "auto", 
    minHeight: "80px", 
  },
};

export default styles;
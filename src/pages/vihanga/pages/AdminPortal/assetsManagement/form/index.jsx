 import React from "react";
 import { Paper ,Box} from "@mui/material";
 import ParentComponent from '../AssetsManagementSystem';

 const Form = () => {
   return (
   <Box>
       <Paper
       elevation={1}
       sx={{
         borderRadius: '16px',
         p: 3,
         m: 2,
         backgroundColor: '#ffffff', 
       }}
     >
       <ParentComponent />
     </Paper>
     </Box>
   );
 };

 export default Form;

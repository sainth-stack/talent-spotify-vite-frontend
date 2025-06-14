// src/LookUpsPage.jsx

import React from "react";
import LookupsForm from "./form";
import LookupsTable from './table'
import { Box, Typography, IconButton, Paper,Card, CardContent, } from "@mui/material";
function LookUpsPage() {
  return (
   
     <Card
      elevation={2}
      sx={{
        
        margin:2,
        borderRadius: 2,
       
      }}
    >
         
      
          <LookupsForm />
          <LookupsTable />
     
           </Card>
   
  );
}

export default LookUpsPage;

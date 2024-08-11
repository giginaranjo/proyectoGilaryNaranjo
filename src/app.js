import express from "express";

const PORT=8080;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extende:true}));

const server=app.listen(PORT,()=>{
    console.log(`Server en puerto ${PORT}`);
    
});

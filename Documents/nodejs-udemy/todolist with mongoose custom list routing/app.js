 const express=require("express");
 const bodyparser=require("body-parser");
 const app=express();
 const _=require("lodash");
 const date=require(__dirname +"/date.js");
 const mongoose=require("mongoose");
 app.use(bodyparser.urlencoded({extended:true}));
 app.set("view engine","ejs");
 

 mongoose.connect("mongodb://localhost:27017/todolistdb");
 const itemschema={
    items:String
 };
 const items=mongoose.model("item",itemschema);

 const item1=new items({
    items:"gokul"
 });
 const item2=new items({
   items:"sundar"
});
const item3=new items({
   items:"abishek"
});
const defaultitem=[item1,item2,item3];

const listschema={
   name:String,
   items:[itemschema]
};
const List=mongoose.model("list",listschema);


 app.get("/",function(req,res)
 {
    

   items.find({},function(err,founditems)
   {
      console.log(founditems);
      if(founditems.length===0)
      {
         
items.insertMany(defaultitem,function(err)
{
   if(err)
   {
      console.log(err);
   }
   else{
      console.log("success");
   }
});
res.redirect("/");



      }
      else{
         res.render("list",{listtitle:"Today",lis:founditems}); 
      }
    
   });
//   var day=date.getDate();
     

 });
 app.post("/",function(req,res)
 {
    //console.log(req.body);
    var item=req.body.list;
    var list=req.body.button;
    //const name=item.toUpperCase();
    console.log(list);
    const newitem=new items({
      items:item
   });
    if(list==="Today")
    {
      newitem.save();
      res.redirect("/");
    }else{
       List.findOne({name:list},function(err,foundlist)
       {
          foundlist.items.push(newitem);
          foundlist.save();
          res.redirect("/"+list);


       });

    }
 
    

 });
 app.post("/delete",function(req,res)
 {
    const id=req.body.checkbox;
    const listname=req.body.listname;
    console.log(listname);
    if(listname==="Today")
    {
      items.findByIdAndRemove(id,function(err)
      {
         if(err)
         {
            console.log(err);
         }
         else{
            console.log("deleted");
            res.redirect("/");
         }
        
      });

    }else{
       List.findOneAndUpdate({name:listname},{$pull:{items:{_id:id}}},function(err,foundlist)
       {
          if(!err)
          {
             res.redirect("/"+listname);
          }

       });
    }
   
   //  items.deleteOne({_id:id},function(err)
   //  {
   //     res.redirect("/");
   //  });

 });
 
 app.get("/:listname",function(req,res)
 {
    const name=req.params.listname;
   //const customlistname=name.toUpperCase();
   const customlistname=_.capitalize(name);;
     List.findOne({name:customlistname},function(err,listitems)
     {
        //console.log(listitems);
        if(!err)
        {
           if(!listitems)
           {
              //console.log("does not ");
              const list=new List({
               name:customlistname,
               items:defaultitem
        
        
            });
            list.save();
            res.redirect("/"+customlistname);

           }
           else{
            console.log("exist");
            res.render("list",{listtitle:listitems.name,lis:listitems.items});

 
         }
        }


     });
   



 });

 app.listen(3000,function()
 {
     console.log("server started");

 });
 
const express = require('express')
const New = require('../models/news')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
router.post('/news',auth,async(req,res)=>{
    
    const news = new New({...req.body,owner:req.reporter._id})
    try{
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/news',auth,async(req,res)=>{
    try{
       await req.reporter.populate('news').execPopulate()
       res.send(req.reporter.news)
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.get('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        
        const neew = await New.findOne({_id,owner:req.reporter._id})
        if(!neew){
            return res.status(404).send('new not found')
        }
        res.status(200).send(neew)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    try{
      
        const neew = await New.findOne({_id,owner:req.reporter._id})
        if(!neew){
            return res.status(404).send('new is not found')
        }
        updates.forEach((update)=> neew[update] = req.body[update])
        await neew.save()
        res.send(neew)
    }
    catch(e){
        res.status(400).send(e)
    }

})


router.delete('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const neew = await New.findOneAndDelete({_id,owner:req.reporter._id})
        if(!neew){
            return res.status(404).send('new is not found')
        }
        res.send(neew)
    }
    catch(e){
        res.status(500).send(e)
    }
})
const upload = multer({
    limits:{
        fileSize: 1000000   
    },
    fileFilter(req,file,cb){
    
       if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
          return  cb(new Error('Please upload an image'))
        } 
        cb(null, true)  
    }
})

router.post('/newsprofile/:id',auth,upload.single('image'),async(req,res)=>{
    try{
        const news=await New.findOne({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('new is not found')
        }
        news.image = req.file.buffer
        news.save()
        res.send('Image uploaded')
    }
    catch(e){
        res.send(e)
    }
})

module.exports = router
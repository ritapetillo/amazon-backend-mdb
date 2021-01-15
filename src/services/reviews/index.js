const express = require("express")

const ReviewSchema = require("../../models/Reviews")

const reviewsRouter = express.Router()


reviewsRouter.post("/",async(req,res,next)=>{
    try {
        const newReview = new ReviewSchema(req.body)
        const {_id} = await newReview.save()
        res.status(201).send(_id)
    } catch (error) {
       
        next(error)
    }
})

reviewsRouter.get("/",async(req,res,next)=>{
    try {
        const reviews = await ReviewSchema.find()
        res.send(reviews)
    } catch (error) {
        console.log(error)
        next(error)
    }
})
reviewsRouter.get("/:id",async(req,res,next)=>{
    try {
        const id = req.params.id
        const review = await ReviewSchema(id)
        if(review){
            res.send(review)
        }else{
            const err = new Error()
            err.httpStatusCode = 404
            next(err)
        }
        
    } catch (error) {
      
        next(error)
    }
})

reviewsRouter.put("/:id",async(req,res,next)=>{
    try {
        const id = req.params.id
        const review = await ReviewSchema.findByIdAndUpdate(id,req,body)
        if(review){
            res.send("Edited")
        }else{
            const err = new Error
            err.httpStatusCode = 404
            next(err)
        }
        
    } catch (error) {
       
        next(error)
    }
})

reviewsRouter.delete("/:id", async(req,res,next)=>{
    try {
        const id = req.params.id
        const review = await ReviewSchema.findByIdAndDelete(id)
        if(review){
            res.send("Deleted!")
        }else{
            const err = new Error
            err.httpStatusCode = 404
            next(err)
        }
    } catch (error) {
        next(error)
    }
})

module.exports = reviewsRouter
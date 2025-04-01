const Label = require("../models/label.model")

exports.create = async (req, res, next) => {
    try{
        const doc = await Label.create(req.body)
        return res.status(200).json({
            success: true,
            result: doc
        })
    }catch(error){
        next(error)
    }
}

exports.findOne = async (req, res, next) => {
    try{
        const {id} = req.params
        if(!id){
            return res.status(400).json({
                success: true,
                error: "id is required"
            })
        }
        const doc = await Label.findOne(id)
        return res.status(200).json({
            success: true,
            result: doc
        })
    }catch(error){
        next(error)
    }
}


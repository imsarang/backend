module.exports = func=>(req,res,next)=>{
    Promise.resolve(func(req,res,()=>{
        res.json({
            success:true
        })
        next()
    })).catch((e)=>{
        console.log(e);
        res.json({
            success:false,
            message:e.message
        })
    })
}
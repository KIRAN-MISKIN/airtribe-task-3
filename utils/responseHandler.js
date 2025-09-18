const responseHandler = (res,status_code,data)=>{
    if(data.message){
    res.status(status_code).json({
        success:true,
        message: data.message
    })
    } else {
    res.status(status_code).json({
        success:true,
        data: data
    })
    }
}

module.exports = {responseHandler}

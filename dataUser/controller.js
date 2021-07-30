const {rizky} = require('./model');
const Redis = require('../redis.connect');

exports.create = async (req, res, next) => {
    try {
        const data = await rizky.create(req.body)
        if (data){
        const input = await rizky.find()
        Redis.set('fetch_2', JSON.stringify(input))
        console.log('Success fetch from database');
            res.status(200).json({
            status: 'success',
            data: data 
        });
        } else {
            res.status(500).json({
                status: "fail",
                message: "Internal Server Error",
              });
        }
    } catch (error) {
        console.error(error);
        return errorHandler(error);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        //adad
        const skip = (req.query.pageNumber -1) * req.query.limit;
        let data;
        const { reply } = await Redis.get('fetch_2')
        const redis_data = JSON.parse(reply || '[]');
        // console.log(redis_data);
        const called_data = redis_data;
        // console.log(reply);
        if (req.query.search === undefined ||
            req.query.search === null ||
            req.query.search === "" ||
            called_data === undefined) {
            data = await rizky.find()
        // console.log(called_data);
        if(data === called_data) {
            console.log('Success fetch from Redis');
        }               
        }else {
            const filterSearch = { userName: { $regex: req.query.search }}
            data = await rizky.find(filterSearch)
            }
        res.status(200).json({
            status: 'success',
            totalCount: data.length,
            data,
        });        
    }catch (error) {
        console.error(error);
    }  
}

exports.getbyaccountNumber = async (req, res, next) => {
    try {
        const accNumber = req.query.accNumber
        const { reply } = await Redis.get('fetch_2')
        const redis_data = JSON.parse(reply || '[]');
        // console.log(redis_data);
        const called_data = redis_data.find(item => item.accountNumber == accNumber);
        console.log(called_data)
        const allData = await rizky.find({ accountNumber: accNumber });
        if(allData) {
            console.log('Success fetch from Redis');
        res.status(200).json({
            status: "success",
            data: allData,
        });
    }
    // console.log(allData) 
    } catch {
        res.status(500).json({
            status: "fail",
            data: "something went wrong",
        });
    }
};

exports.getbyidentityNumber = async (req, res, next) => {
    try {
        const identity = req.query.identity
        const { reply } = await Redis.get('fetch_2')
        const redis_data = JSON.parse(reply || '[]');
        // console.log(redis_data);
        const called_data = redis_data.find(item => item.identityNumber == identity);
        console.log(called_data)
        const allData = await rizky.find({ identityNumber: identity });
        if(allData)
        console.log('Success fetch from Redis')
        res.status(200).json({
            status: "success",
            data: allData,
        });
    } catch {
        res.status(500).json({
            status: "fail",
            data: "something went wrong",
        });
    }
};

exports.update = async (req, res, next) => {
    try {
        const data = await rizky.findByIdAndUpdate(req.params.id, req.body)
            
        if(data) {
            const input = await rizky.find()
            Redis.set('fetch_2', JSON.stringify(input))
            console.log('Success fetch from database');
            res.status(200).json({
                status: 'data has been update',
                data : data
              });
            
        }else{
            return next(new AppError('No document found with that ID', 404));
        }
        
    }catch {
        res.status(500).json({
            status: "fail",
            data: "something went wrong",
        });
    }

}

exports.delete = async (req, res, next)=>{
    const data = await rizky.findByIdAndDelete(req.params.id);
    
    if(!data){
            const input = await rizky.find()
            Redis.set('fetch_2', JSON.stringify(input))
            console.log('Success fetch from database');
            res.status(200).json({
                status: 'delete success',
              });
      
    }else{
        return next(new AppError('No document found with that ID', 404));
    }
}    
const asyncErrorHandler = (fn)=> {
    return (req, res, next) => {
        if(typeof fn !== 'function'){
            throw new TypeError('asyncErrorHandler expected a function');
        }
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}

module.exports = {asyncErrorHandler};
const validateRole =(...roles)=>{
    return (req = request, res = response, next) => {
    
        console.log(req.userAuth)

        if (!req.userAuth) {
            return res.status(500).json({
                msg: 'First validate token',
            });
        }

        if(!roles.includes(req.userAuth.role)){
            return res.status(401).json({
                msg: `User needed role: ${roles}`,
            });
        }

        next();
    }
}

module.exports={
    validateRole,
}
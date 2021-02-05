module.exports = function authenticate(req, res, next) {
    if(typeof req.session.user !== 'undefined'){
        next();
    }else{
        res.status(400).render('user/login',{
            error: "Inicie sesion antes de empezar"
        });
    }
};
exports.isAuth = (req, res, next) => {
    // Check if user is Login 
    if(req.session.userId) next()
    else res.redirect('/login');
};

exports.notAuth = (req, res, next) => {
    if(!req.session.userId) next()
    else res.redirect('/');
};
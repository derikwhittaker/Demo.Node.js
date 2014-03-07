
function adminView(request, response) {
    response.render('admin.html');
}

function indexView(request, response) {
    response.render('index.html');
}


function init(app) {
    app.get('/', indexView);
    app.get('/admin', adminView);
    
    console.log("View Controller Setup");
}

module.exports = init;
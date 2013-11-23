
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index',
      { title: 'Destination.to' }
  );
};

exports.db = function(req, res) {
    res.render('index', {
            title : "Some test"
        }
    )
}
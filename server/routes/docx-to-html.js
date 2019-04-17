var mammoth = require("mammoth");
 
const convertDocxToHtml = (file, res) => {
	mammoth.convertToHtml({path: file.path})
    .then(function(result){
        var html = result.value; // The generated HTML
        if(html) {
        	console.log('docx file has been recieved @ ' + new Date().toISOString().
  														replace(/T/, ' ').      // replace T with a space
  														replace(/\..+/, '')     // delete the dot and everything after
  														 + 'GMT')
        	res.send(html)
        } else {
        	res.send(result.messages);
        }
    })
    .catch(function(error) {
    	console.log('**** ERROR!!!! ****: ',error);
    	req.send('Error!');
    })
    .done();
}

module.exports = function(app) {

	app.post('/docx', (req, res) => {
		if(req.files['file']) {
			convertDocxToHtml(req.files['file'], res)
		} else {
			res.send('We did not receive your file. Please try again.')
		}
	});
};
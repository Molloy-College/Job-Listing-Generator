/* Does not work..?
let PDFParser = require("pdf2json");
 
let pdfParser = new PDFParser();

const convertPdfToJson2 = (file, res) => {
	pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
	pdfParser.on("pdfParser_dataReady", pdfData => {
	    console.log(JSON.stringify(pdfData))
	    res.send(JSON.stringify(pdfData));
	});

	pdfParser.loadPDF(file.path);
}
*/

/* Does not maintain pdf table formatting 
var pdf2html = require('pdf2html');

const convertPdfToHtml = (file, res) => {
	pdf2html.html(file.path, (err, html) => {
	    if (err) {
	        console.error('Conversion error: ' + err)
	    } else {
	        res.send(html)
	    }
	})
}
*/

var pdf_table_extractor = require("pdf-table-extractor");

const convertPdfToJson = (file, res) => {
	const successHelper = (result) => {
		console.log('PDF file recieved!')
		res.send(result)
	}

	const errorHelper = (result) => {
		res.send(result);
	}

	pdf_table_extractor(file.path, successHelper, errorHelper);
}

module.exports = function(app) {
	app.post('/pdf', (req, res) => {
		// convertPdfToJson(req.files['file'], res);
		convertPdfToHtml(req.files['file'], res);
		// convertPdfToJson2(req.files['file'], res);
	});
}
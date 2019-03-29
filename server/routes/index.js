const pdfToJson = require('./pdf-to-json.js');
const docxToHtml = require('./docx-to-html.js');

module.exports = function(app) {
	pdfToJson(app);
	docxToHtml(app);
};
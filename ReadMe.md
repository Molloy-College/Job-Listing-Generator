## ABOUT
This web app parses the content of ANY Molloy Job Template .docx file and uses that relevant parsed content to automatically generate a more presentable job listing. 

The app flows in one of the two following ways:
1. The client uploads a Molloy-Job-Template.docx and sends the file to the server's docx-to-html.js route -> the server's route uses the 'Mammoth.js' api to convert the Molloy-Job-Template.docx into html -> the client recieves the html, which fires a series of function calls that parses the html and pulls relevant data from its contents -> those contents populate input fields -> those input fields are then sent to a div whose styling is set to "display: none;" which contains pre-written content for the Job-Listing.docx -> that "display: none;" div is then used to generate the Job-Listing.docx 

2. The user manually types into the input fields on the website, and selects the 'GENERATE WORD DOCUMENT' button, and thereby never interacts with the server or its routes.

## TO RUN
1. DOWNLOAD DEPENDENCIES:
```
cd server
npm update
```

2. LAUNCH SERVER:
```
cd server 		### skip this step if you're already in the server directory
nodemon server.js
```
	
3. Open index.html

## NOTES
- Minor changes to the generated job listing may be needed - it's not a perfect automation.

- Included in the index.html page is a button that converts the web app into pdf. Pdf is difficult to work with and its formatting can be inconsistent; this program's intended users would not be able to edit the pdf file if errors exist, so the button is temporarily disabled. It can be re-enabled, and would thereafter be fully functional. 

- Included in the server directory is a pdf-to-html route. The "pdf-table-extractor" and "pdf2json" libraries conversion between files is inconsistent and difficult to parse in contrast to the doc-to-html library "Mammoth."

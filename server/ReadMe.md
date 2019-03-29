### To run:
	cd to automated_job_listing_(git)
	cd server
	nodemon server.js

### ** CANNOT USE BOTH body-parser AND formidable middlewares! Leaning towards 

# body-parser
	- Unfortunately, Express can't proess URL encoded forms on its own - fields sent to a server via a POST request. But the body-parser package allows for this functionality:
		expressApp.use(bodyParser.urlencoded({ extended: true }));

# formidable
	- For handling multipart data - such as pdf and docx. 

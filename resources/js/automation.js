$(document).ready(function(){
	// Resets the file so that if a duplicate file is selected, the '.change' listener will still hit
	$('input[type="file"]').click(function(){
		$(this).val('');
	});

    $('input[type="file"]').change(function(e){
        const fileName = e.target.files[0].name;
        const fileExtension = fileName[fileName.length-1] === 'x'? "docx" : fileName[fileName.length-1] === 'f'? "pdf" : "error"
        if(fileExtension === 'pdf') {
        	// postPdf(e.target.files[0]);
        	alert('pdf is currently unsupported. Please convert this file to docx at this site: https://pdf2docx.com/')
        } else if(fileExtension === 'docx') {
        	postDocx(e.target.files[0]);
        } else {
        	alert('The file you selected ("' + fileName +  '") is not a pdf or a docx document. Please choose a pdf or docx document.');
        }
    });
});

const findFileExtensionType = (fileName) => {
	let extension = []
	for(let i=fileName.length-1; i>0; i--) {
		if(fileName[i] === '.') {
			break;
		} else {
			extension.push(fileName[i]);
		}
    }
    return extension;
}

const postDocx = (file) => {
	var form = new FormData();
	form.append("file", file);

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "http://localhost:8000/docx",
	  "method": "POST",
	  "headers": {
	  },
	  "processData": false,
	  "contentType": false,
	  "mimeType": "multipart/form-data",	
	  "data": form
	}

	$.ajax(settings).done(function (response) {
	  $('#results').empty();
	  $('#results').append(response);
	  parseHtml();
	});
};

const parseHtml = () => {
	
	// index/element: 0/Job Title, 1/Department, 2/Supervisor/Manager's Title
	let arrayOfBasicInfo = getBasicInfo();
	$('#title-input').val(arrayOfBasicInfo[0]);
	$('#department-input').val(arrayOfBasicInfo[1]);
	$('#supervisor-input').val(arrayOfBasicInfo[2]);
	
	///////////////
	// Work Hours and Travel
	let workHoursAndTravelText = getWorkHoursAndTravelInfo();
	$('#hours-input').val(workHoursAndTravelText);

	//////////////
	// Third table - General Purpose
	let jobDescription = $('#results table:nth-child(3) tr:nth-child(3) td p').text();
	$('#general-input').val(jobDescription);

	//////////////
	// Essential Functions
	let arrayOfEssentialFunctions = getEssentialFunctionsInfo();
	// Check if there exists more essential functions than available input spaces on the website
	if(arrayOfEssentialFunctions.length > 6) {
		// Add more essential function input spaces
		for(let i=6; i < arrayOfEssentialFunctions.length; i++) {
			$('#essential-functions-input-ul').append('<li><textarea class="bulleted-text-area" id="essential-'+i+'-input"></textarea></li><br/>')
		}
	}
	// Enter each essential function into their respective inputs
	for(let i=0; i<arrayOfEssentialFunctions.length; i++) {
		$('#essential-'+i+'-input').val(arrayOfEssentialFunctions[i]);
	}

	//////////////
	// DESIRED MINIMUM QUALIFICATIONS
	let arrayOfDesiredMinimumQualifications = [];
	// Computer and Software Skills - 7th tabe
	$('#results table:nth-child(7) tr:nth-child(3) table tr').each(function(index) {
		switch(index) {
			case 0: // fall through
			case 1: break;
			case 10: 
				if($(this).text().includes('☒')) {
					let reqOrPref = 'preferred'; 
					if($(this).find('td:nth-child(3)').text().includes('☒')) {
						let reqOrPref = 'required';
					}
					
					let levelOfProficiency = 'Basic';
					if($(this).find('td:nth-child(6)').text().includes('☒')) {
						levelOfProficiency = 'Intermediate';
					} else {
						levelOfProficiency = 'Advanced';
					}

					let comments = $(this).find('td:nth-child(8)').text();

					arrayOfDesiredMinimumQualifications.push(
						levelOfProficiency + 
						' level of proficiency in a specialized skill/software' +
						' is ' +
						reqOrPref +
						' for this position: ' +
						comments
					)
				} 
				break;
			default: 
				// If 'this' skill is needed for the position
				if($(this).text().includes('☒')) {
					let softwareName = $(this).find('td:first-child').text();

					let reqOrPref = 'preferred'; 
					if($(this).find('td:nth-child(2)').text().includes('☒')) {
						let reqOrPref = 'required';
					}
					
					let levelOfProficiency = 'Basic';
					if($(this).find('td:nth-child(5)').text().includes('☒')) {
						levelOfProficiency = 'Intermediate';
					} else {
						levelOfProficiency = 'Advanced';
					}

					let comments = $(this).find('td:nth-child(7)').text();

					arrayOfDesiredMinimumQualifications.push(
						levelOfProficiency + 
						' level of proficiency in ' +
						softwareName +
						' is ' +
						reqOrPref +
						' for this position. ' +
						comments
					) 
				}
				break;
		}
	})

	// Education - 10th Table
	$('#results table:nth-child(10) tr:nth-child(3) table tr').each(function(index) {
		switch(index) {
			case 0: break;
			default:
				// console.log($(this).find('td:first-child').text())
				if($(this).find('td:first-child').text().includes('☒')) {
					let levelOfEducation = $(this).find('td:nth-child(2)').text();
					let fieldOfStudy = $(this).find('td:last-child').text();
					let comments = $(this).parent().find('tr:last-child').text();
					arrayOfDesiredMinimumQualifications.push(
						levelOfEducation +
						' in ' +
						fieldOfStudy +
						" is generally necessary to effectively handle the job's essential functions. " +
						comments
					)
				}
				break;
		}
	});
	// TODO:
	// Work Experience - 11th Table
	if($('#results table:nth-child(11) tr:nth-child(3)').text().includes('☒')) {
		let minimumWorkExperience = 'Minimum level of work related experience required: '
		$('#results table:nth-child(11) tr:nth-child(3) td').each(function(index) {
			if($(this).text().includes('☒')) {
				minimumWorkExperience = minimumWorkExperience + $(this).text();
			}
		});
	} else if($('#results table:nth-child(11) tr:nth-child(4)').text().includes('☒')) {
		$('#results table:nth-child(11) tr:nth-child(4) td').each(function(index) {
			switch(index) {
				case 0: 
				case 1:
				case 2:
			}
		});
	}

	//	Knowledge -	12th Table
	arrayOfDesiredMinimumQualifications.push($('#results table:nth-child(12) tr:last-child td p').text());
	console.log(arrayOfDesiredMinimumQualifications);

	// Check if there exists more desired qualifications than available input spaces on the website
	if(arrayOfDesiredMinimumQualifications.length > 6) {
		// Add more desired qualifications input spaces
		for(let i=6; i < arrayOfDesiredMinimumQualifications.length; i++) {
			$('#desired-qualifications-input-ul').append('<li><textarea class="bulleted-text-area" id="essential-'+i+'-input"></textarea></li><br/>')
		}
	}
	// Enter each essential function into their respective inputs
	for(let i=0; i<arrayOfDesiredMinimumQualifications.length; i++) {
		$('#desired-'+i+'-input').val(arrayOfDesiredMinimumQualifications[i]);
	}

	//////////////
	// Supervision Exercised
	// 8th Table 
	let supervisionExcercisedText = getSupervisionExercisedInfo();
	$('#supervision-input').val(supervisionExcercisedText);

}

const getBasicInfo = () => {
	const arrayOfBasicInfo = [];
	// 2nd table - Position Title, Department, Supervisor, Work Hours, date
	// 0| Job Title: , 1| Department: , 2| Supervisor/Manager's Title: , 3| Work Hours & Travel
	$('#results table:nth-child(2) tr td p').each(function(index) {
		let tempText = $(this).text();
		switch(index) {
			case 0: // Job Title
				tempText = tempText.substring(11)
				arrayOfBasicInfo.push(tempText);
				break;
			case 1: // Department
				tempText = tempText.substring(12)
				arrayOfBasicInfo.push(tempText);
				break;
			case 2: // Supervisor/Manager's Title
				tempText = tempText.substring(28)
				arrayOfBasicInfo.push(tempText);
				break;
			case 3: // Author of Job Description
				// tempText = tempText.substring(28)
				// arrayOfBasicInfo.push(tempText);
				break;
			case 4: // Date
				// tempText = tempText.substring(6)
				// arrayOfBasicInfo.push(tempText);
				break;
			default: break;
		}
	});
	return arrayOfBasicInfo;
}

const getEssentialFunctionsInfo = () => {
	let arrayOfEssentialFunctions = [];

	// Fourth table
	$('#results table:nth-child(5) tr').each(function(index) {
		switch(index) {
			case 0:
				break;
			case 1:
				break;
			default:
				arrayOfEssentialFunctions.push($(this).find('td[colspan=3] p:nth-child(1)').text());
				break;
		}
	});
	arrayOfEssentialFunctions.forEach(function(element, index) {
		if(element===" " || element==="" || element === "   ") {
			arrayOfEssentialFunctions.splice(index, 1)
		}
	});

	return arrayOfEssentialFunctions;
}

const getWorkHoursAndTravelInfo = () => {
	// Fifth Table
	// Work Hours and Travel - 'Select all that apply: ☐ or ☒'
	let workHoursAndTravelText = '';
	$('#results table:nth-child(6) tr').each(function(index) {
		switch(index){
			case 2: // ☐ Requiried to be on campus during core days/hours of 
				if( $(this).text().includes('☒') ) {
					workHoursAndTravelText = workHoursAndTravelText + 'Requiried to be on campus during core days/hours of ' + $(this).find('td:last-child').text() + '. ';
				}
				break;
			case 3: // ☐ Work hours and location may be flexible under some circumstances
				if( $(this).text().includes('☒') ) {
					workHoursAndTravelText = workHoursAndTravelText + 'Work hours and location may be flexible under some circumstances. The employee will work ' + $(this).find('td:last-child').text() + '. ';
				}
				break;
			case 4: // ☐ 12 month ☐ Summer off Number of weeks off:
				if( $(this).find('td').text().includes('☒') ) { // 12 month
					workHoursAndTravelText = workHoursAndTravelText + 'This job operates on a 12 month working schedule. ';
				}

				if( $(this).find('td:nth-child(2)').text().includes('☒') ) { // Summer off
					workHoursAndTravelText = workHoursAndTravelText + 'We offer every Summer off for this position. ';
				}

				if( $(this).find('td:last-child').text() ) { 
					workHoursAndTravelText = workHoursAndTravelText + 'We also offer ' + $(this).find('td:last-child').text() + ' weeks off. ';
				}
				break;
			case 5: // ☐ Part Time:
				if( $(this).find('td').text().includes('☒') ) {
					workHoursAndTravelText = workHoursAndTravelText + 'This position is Part Time: ' + $(this).find('td:last-child').text() + '. ';
				}
				break;
			case 6: // ☐ Evening, holiday, or weekend work required
				if( $(this).find('td').text().includes('☒') ) {
					workHoursAndTravelText = workHoursAndTravelText + 'Evening, holiday, or weekend work required. ';
				}
				break;
			case 7: // ☐ Occasional weekend work
				// Fall through
			case 8: // ☐ Regular weekend work
				// Fall through
			case 9: // ☐ Periods of high volume/work load
				// Fall through
			case 10: // ☐ Occasional Travel required
				if( $(this).find('td').text().includes('☒') ) {
					workHoursAndTravelText = workHoursAndTravelText + $(this).find('td:last-child').text() + '. ';
				}
				break;
			default: break;
		}
	});

	return workHoursAndTravelText;
}

const getSupervisionExercisedInfo = () => {
	let supervisionExcercisedText = '';
	$('#results table:nth-child(8) tr').each(function(index) {
		switch(index){
			case 2: // ☐ Not responsible for supervising others (students, staff, administrator employees)
				// Fall Through
			case 4: // ☐ Assigned Lead (non-students): May recommend the following: employee hiring; disciplinary action and input on performance evaluations.
				// Fall through
			case 5: // ☐ Supervises work of others (non-students), including planning, assigning, scheduling and reviewing work, ensuring quality standards. Is responsible for hiring, terminating, training and developing, reviewing performance and administering corrective action for staff. Plans organizational structure and job content.
				// Fall through
			case 7: // ☐ Assigned Lead (students): May recommend the following: employee hiring; disciplinary action and input on performance evaluations.
				// Fall through
			case 8: // ☐ Supervises work of others (students), including planning, assigning, scheduling and reviewing work, ensuring quality standards. Is responsible for hiring, terminating, training and developing, reviewing performance and administering corrective action for students. Plans organizational structure and job content.
				if( $(this).find('td').text().includes('☒') ) { 
					supervisionExcercisedText = supervisionExcercisedText + $(this).find('td').text().substring(2) + ' ';
				}
				// Fall through
				break;
			default:
				break;
		}
	});
	return supervisionExcercisedText;
}
$(document).ready(function(){
	// Resets the file inside the file input tag so that if a duplicate is selected, the '.change' listener that fires the automation will still fire
	$('input[type="file"]').click(function(){
		$(this).val('');
	});

	$('input[type="file"]').change(function(e){
			const fileName = e.target.files[0].name;
			const fileExtension = fileName[fileName.length-1] === 'x'? "docx" : fileName[fileName.length-1] === 'f'? "pdf" : "error"
			if(fileExtension === 'pdf') {
				// postPdf(e.target.files[0]);
				alert('pdf is currently unsupported. Please convert this file to docx at this site: https://www.pdfhero.com/pdf-to-word.php')
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
	  parseHtmlAndFillInputs();
	  generateWord();
	});
};

const cleanString = (string) => {
	return string.replace(/\s/g,'').toLowerCase();
}

const parseHtmlAndFillInputs = () => {
	let dictOfTables = {
		'Job Title': null,
		'Job Summary': null,
		'Essential Functions': null,
		'Work Hours and Travel': null,
		'Computer and Software Skills': null,
		'Supervisory Responsibilities': null,
		'Budget Responsibilities': null,
		'Education': null,
		'Work Experience': null,
		'Knowledge': null,
		'Collaboration/Service': null,
		'Decision Making': null,
		'Problem Solving': null,
		'Independence of Action': null,
		'Physical/Environmental Demands': null,
		'Additional Information': null
	}

	// Run through the document's html once and compartment each table's data into dictOfTables object based on each table's heading name
	$('#results table tr').each(function(index) {
		let trText = $(this).text();
		Object.keys(dictOfTables).forEach((desiredTableName) => {
			// Check for an exact match of text to sought text
			if (cleanString(trText) === (cleanString(desiredTableName))) { 
				dictOfTables[desiredTableName] = $(this).closest('table')
				
			} else if(cleanString(trText).includes(cleanString(desiredTableName)) && dictOfTables[desiredTableName] === null) {
				// search for a 'close enough' match via the existence of the sought text as a substring, rather than an exact match
				dictOfTables[desiredTableName] = $(this).closest('table')
			}
		})
	})

	// index/element: 0/Job Title, 1/Department, 2/Supervisor/Manager's Title. Not included in dictOfTables object
	let arrayOfBasicInfo = getBasicInfo(dictOfTables['Job Title']);
	$('#title-input').val(arrayOfBasicInfo[0]);
	$('#department-input').val(arrayOfBasicInfo[1]);
	$('#supervisor-input').val(arrayOfBasicInfo[2]);
	
	/**
	 * Work Hours and Travel
	 */
	let workHoursAndTravelText = getWorkHoursAndTravelInfo(dictOfTables['Work Hours and Travel']);
	$('#hours-input').val(workHoursAndTravelText);

	//////////////
	// Third table - General Purpose
	let jobDescription = $(dictOfTables['Job Summary']).find('tr:nth-child(3)').text();
	$('#general-input').val(jobDescription);

	//////////////
	// Essential Functions
	$('#essential-functions-input-ul').empty();
	let arrayOfEssentialFunctions = getEssentialFunctionsInfo(dictOfTables['Essential Functions']);
	const numOfEssentialFunctions = arrayOfEssentialFunctions.length;
	const numOfAvailableEssentialInputs = $('#essential-functions-input-ul').length;

	console.log('numOfEssentialFunctions', numOfEssentialFunctions);
	console.log('numOfAvailableEssentialInputs', numOfAvailableEssentialInputs);

	// Check if there exists more essential functions than available input spaces on the website
	if(numOfEssentialFunctions > numOfAvailableEssentialInputs) {
		// Add more essential function input and fill spaces. i = number, but not index. id is based on index, which begins at 0.
		for(let i=numOfAvailableEssentialInputs; i < numOfEssentialFunctions; i++) {
			addEssentialFunctionInputAndFill();
		}
	} 

	// fill essential functions input fields
	$('#essential-functions-input-ul li').each(function(index) {
		$(this).find('textarea').val(arrayOfEssentialFunctions[index])
	});

	/**
	 * DESIRED MINIMUM QUALIFICATIONS
	 * - utilize array's passing by reference throughout multiple function calls
	 */
	$('#desired-qualifications-input-ul').empty();
	let arrayOfDesiredMinimumQualifications = [];
	getComputerAndSoftwareSkills(arrayOfDesiredMinimumQualifications, dictOfTables['Computer and Software Skills']) // Computer and Software Skills - 7th Table
	getEducation(arrayOfDesiredMinimumQualifications, dictOfTables['Education']); // Education - 10th Table
	getWorkExperience(arrayOfDesiredMinimumQualifications, dictOfTables['Work Experience']);// Work Experience - 11th Table
	arrayOfDesiredMinimumQualifications.push($(dictOfTables['Knowledge']).find('tr:last-child td p').text()); //	Knowledge -	12th Table
	
	const numOfDesiredQualifications = arrayOfDesiredMinimumQualifications.length;
	const numOfAvailableDesiredQualInputs = $('#desired-qualifications-input-ul').length;

	// Check if there exists more Desired Functions than available input spaces on the website
	if(numOfDesiredQualifications > numOfAvailableDesiredQualInputs) {
		// Add more essential function input and fill spaces. i = number, but not index. id is based on index, which begins at 0.
		for(let i=numOfAvailableDesiredQualInputs; i < numOfDesiredQualifications; i++) {
			addDesiredQualificationsInputAndFill();
		}
	} 

	// fill desired qualifications input fields
	$('#desired-qualifications-input-ul li').each(function(index) {
		$(this).find('textarea').val(arrayOfDesiredMinimumQualifications[index])
	});

	//////////////
	// Supervision Exercised
	// 8th Table 
	let supervisionExcercisedText = getSupervisionExercisedInfo(dictOfTables['Supervisory Responsibilities']);
	$('#supervision-input').val(supervisionExcercisedText);
}

const getBasicInfo = (basicInfoTable) => {
	const arrayOfBasicInfo = [];
	// 2nd table - Position Title, Department, Supervisor, Work Hours, date
	// 0| Job Title: , 1| Department: , 2| Supervisor/Manager's Title: , 3| Work Hours & Travel
	$(basicInfoTable).find('tr td p').each(function(index) {
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

const getComputerAndSoftwareSkills = (arrayOfDesiredMinimumQualifications, computerAndSoftwareTable) => {
	// Computer and Software Skills - 7th table
	let requiredObj = {};
	let preferredObj = {};
	$(computerAndSoftwareTable).find('tr:nth-child(3) table tr').each(function(index) {
		switch(index) {
			case 0: // fall through
			case 1: break;
			case 10: 
				if($(this).text().includes('☒')) {
					let softwareName = $(this).find('td:nth-child(2)').text();
					let comments = $(this).find('td:nth-child(8)').text();
					if(comments) {
						softwareName = softwareName + ' (' + comments + ')'; 
					}

					if($(this).find('td:nth-child(3)').text().includes('☒')) {
						requiredObj[softwareName] = 1;
					} else {
						preferredObj[softwareName] = 1;
					}
					
					let levelOfProficiency = 'Basic';
					if($(this).find('td:nth-child(6)').text().includes('☒')) {
						levelOfProficiency = 'Intermediate';
					} else {
						levelOfProficiency = 'Advanced';
					}

					if(requiredObj[softwareName]) {
						requiredObj[softwareName] = levelOfProficiency
					} else {
						preferredObj[softwareName] = levelOfProficiency
					}
				} 
				break;
			default: 
				// If 'this' skill is needed for the position
				if($(this).text().includes('☒')) {
					let softwareName = $(this).find('td:first-child').text();
					let comments = $(this).find('td:nth-child(7)').text();
					if(comments) {
						softwareName = softwareName + ' (' + comments + ')'; 
					}

					if($(this).find('td:nth-child(2)').text().includes('☒')) {
						requiredObj[softwareName] = 1;
					} else {
						preferredObj[softwareName] = 1;
					}
					
					let levelOfProficiency = 'Basic';
					if($(this).find('td:nth-child(5)').text().includes('☒')) {
						levelOfProficiency = 'Intermediate';
					} else {
						levelOfProficiency = 'Advanced';
					}

					if(requiredObj[softwareName]) {
						requiredObj[softwareName] = levelOfProficiency
					} else {
						preferredObj[softwareName] = levelOfProficiency
					}
				}
				break;
		}
	})
	
	arrayOfDesiredMinimumQualifications.push(
		'Required skills: ' + 
		Object.keys(requiredObj).map(function(skill) {
			return ' ' + requiredObj[skill] + ' proficiency with ' + skill;
		})
	)
	
	arrayOfDesiredMinimumQualifications.push(
		'Preferred skills: ' + 
		Object.keys(preferredObj).map(function(skill) {
			return ' ' + preferredObj[skill] + ' proficiency with ' + skill;
		})
	)
}

const getEducation = (arrayOfDesiredMinimumQualifications, educationTable) => {
	// Education - 10th Table
	$(educationTable).find('tr:nth-child(3) table tr').each(function(index) {
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
}

const getWorkExperience = (arrayOfDesiredMinimumQualifications, workExperienceTable) => {
	// Work Experience - 11th Table
	let minimumWorkExperience = 'Minimum level of related work experience required: '
	if($(workExperienceTable).find('tr:nth-child(3)').text().includes('☒')) {
		$(workExperienceTable).find('tr:nth-child(3) td').each(function(index) {
			if($(this).text().includes('☒')) {
				minimumWorkExperience = minimumWorkExperience + $(this).text().substring(2) + '. ';
				arrayOfDesiredMinimumQualifications.push(minimumWorkExperience);
			}
		});
	} else if($(workExperienceTable).find('tr:nth-child(4)').text().includes('☒')) {
		$(workExperienceTable).find('tr:nth-child(4) td').each(function(index) {
			switch(index) {
				case 0: // 1-3 years 
					// fall through
				case 1: // 3-5 years
					if($(this).text().includes('☒')) {
						minimumWorkExperience = minimumWorkExperience + $(this).text().substring(2) + '. ';
					}
					break;
				case 2: // other
					break;
				case 3: // 'other' description
					minimumWorkExperience = minimumWorkExperience + $(this).text();
					arrayOfDesiredMinimumQualifications.push(minimumWorkExperience);
					break;
			}
		});
	}
}

const getEssentialFunctionsInfo = (essentialFunctionsTable) => {
	let arrayOfEssentialFunctions = [];

	console.log(essentialFunctionsTable)
	// Fourth table
	$(essentialFunctionsTable).find('tr').each(function(index) {
		switch(index) {
			case 0:
				break;
			case 1:
				break;
			default:
				// even index = descriptive information we want. 
				// odd index = '_ % of time' section
				if(index%2===0){
					arrayOfEssentialFunctions.push($(this).text());
				}
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

const getWorkHoursAndTravelInfo = (workHoursTable) => {
	let workHoursAndTravelText = ''
	$(workHoursTable).find('tr').each(function(index) {
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
			/*case 4: // ☐ 12 month ☐ Summer off Number of weeks off:
				if( $(this).find('td').text().includes('☒') ) { // 12 month
					workHoursAndTravelText = workHoursAndTravelText + 'This job operates on a 12 month working schedule. ';
				}

				if( $(this).find('td:nth-child(2)').text().includes('☒') ) { // Summer off
					workHoursAndTravelText = workHoursAndTravelText + 'We offer every Summer off for this position. ';
				}

				if( $(this).find('td:last-child').text() ) { 
					workHoursAndTravelText = workHoursAndTravelText + 'We also offer ' + $(this).find('td:last-child').text() + ' weeks off. ';
				}
				break;*/
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

const getSupervisionExercisedInfo = (supervisionTable) => {
	let supervisionExcercisedText = '';
	$(supervisionTable).find('tr').each(function(index) {
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
 margins = {
     top: 70,
     bottom: 80, //180
     left: 60,
     width: 485
 };

 function addEssentialFunctionInputAndFill() {
    $('#essential-functions-input-ul').append('<li><button type="button" class="btn btn-default btn-sm deleteButton"><i class="far fa-trash-alt"></i></button><textarea class="bulleted-text-area"></textarea><br/></li>');
			$('#ul-essential-fill-for-doc').append('<li></li>')
 }

 function addDesiredQualificationsInputAndFill() {
    $('#desired-qualifications-input-ul').append(
        '<li><button type="button" class="btn btn-default btn-sm deleteButton"><i class="far fa-trash-alt"></i></button><textarea class="bulleted-text-area"></textarea><br/></li>'
        );
    $('#ul-desired-fill-for-doc').append('<li></li>')
 }

 // event handlers
 $(document).on('click', '.deleteButton', (function() {
    $(this).parent().remove();
 }));

 $(document).on('click', '#essentialFunctionsAddButton', (function() {
    addEssentialFunctionInputAndFill();
}));

 $(document).on('click', '#desiredMinimumAddButton', (function() {
    addDesiredQualificationsInputAndFill()
 }));

 function generatePDFWindow() {
     var pdf = new jsPDF('p', 'pt', 'a4');
     pdf.setFontSize(16);
     
     pdf.fromHTML(document.getElementById('html-2-pdfwrapper'),
         margins.left, // x coord
         margins.top, {
             // y coord
             width: margins.width // max width of content on PDF
         },
         function (dispose) {
             headerFooterFormatting(pdf, pdf.internal.getNumberOfPages());
         },
         margins);
     /*
     var iframe = document.createElement('iframe');
     iframe.setAttribute('style', 'position: absolute; right: 0; top: 0; bottom: 0; height:91%; width:700px; padding:20px;');
     document.body.appendChild(iframe);
     iframe.src = pdf.output('datauristring');
     */
     window.open(pdf.output('bloburl'), '_blank');
 };

 function headerFooterFormatting(doc, totalPages) {
     for (var i = totalPages; i >= 1; i--) {
         doc.setPage(i);
         //header
         //header(doc);

         footer(doc, i, totalPages);
         doc.page++;
     }
 };

 function header(doc) {
     doc.setFontSize(30);
     doc.setTextColor(40);
     doc.setFontStyle('normal');

     doc.text("Report Header Template", margins.left + 50, 40);
     doc.setLineCap(2);
     doc.line(3, 70, margins.width + 43, 70); // horizontal line
 };

 // You could either use a function similar to this or pre convert an image with for example http://dopiaza.org/tools/datauri
 // http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
 function imgToBase64(url, callback, imgVariable) {

     if (!window.FileReader) {
         callback(null);
         return;
     }
     var xhr = new XMLHttpRequest();
     xhr.responseType = 'blob';
     xhr.onload = function () {
         var reader = new FileReader();
         reader.onloadend = function () {
             imgVariable = reader.result.replace('text/xml', 'image/jpeg');
             callback(imgVariable);
         };
         reader.readAsDataURL(xhr.response);
     };
     xhr.open('GET', url);
     xhr.send();
 };

 function footer(doc, pageNumber, totalPages) {

     var str = "Page " + pageNumber + " of " + totalPages;
     var date = new Date().toLocaleDateString();
     var dep = $('#department-input').val();
     let title = $('#title-input').val();

     doc.setFontSize(10);
     doc.setDrawColor(166, 166, 166);
     doc.line(margins.left, doc.internal.pageSize.height - 60, doc.internal.pageSize.width - margins.left, doc.internal.pageSize.height - 60); // horizontal line at footer
     doc.line(margins.left + 75, doc.internal.pageSize.height - 15, margins.left + 75, doc.internal.pageSize.height - 60); // vertical line at footer

     doc.text(str, margins.left, doc.internal.pageSize.height - 30); // page #
     doc.text(title, margins.left + 85, doc.internal.pageSize.height - 46); //position title
     doc.text(dep, margins.left + 85, doc.internal.pageSize.height - 33); //department
     doc.text(date, margins.left + 85, doc.internal.pageSize.height - 19); //date
 };

 function assignTextFields() {
     let title = $('#title-input').val();
     $('#position-title-top').append(title.toUpperCase());
     $('#bottom-title').append(title);
     
     let dep = $('#department-input').val();
     $('#department-fill').append(dep);
     $('#bottom-department').append(dep);
     
     let date = new Date().toLocaleDateString();
     $('#bottom-date').append(date);
     
     let sup = $('#supervisor-input').val();
     $('#supervisor-fill').append(sup);

     $('#hours-fill').append($('#hours-input').val());
     $('#gradeOrSalary-fill').append($('#gradeOrSalary-input').val());
     $('#general-fill').append($('#general-input').val());
     
     let arrOfEssentialInputs = [];
     $('#essential-functions-input-ul li').each(function(index) {
        arrOfEssentialInputs.push($(this).find('textarea').val());
     });

     $('#ul-essential-fill-for-doc li').each(function(index) {
        $(this).append(arrOfEssentialInputs[index]);
     });
     
     let arrOfDesiredInputs = [];
     $('#desired-qualifications-input-ul li').each(function(index) {
        arrOfDesiredInputs.push($(this).find('textarea').val());
     });

     $('#ul-desired-fill-for-doc li').each(function(index) {
        $(this).append(arrOfDesiredInputs[index]);
     });

     $('#supervision-fill').append($('#supervision-input').val());
 }

 function resetStaticElements() {
     $('#position-title-top').empty();
     $('#bottom-title').empty();
     $('#department-fill').empty();
     $('#bottom-department').empty();
     $('#bottom-date').empty();
     $('#supervisor-fill').empty();
     $('#hours-fill').empty();
     $('#gradeOrSalary-fill').empty();
     $('#general-fill').empty();
     $('#essential-fill').empty();
     $('#desired-fill').empty();
     $('#supervision-fill').empty();

    //  $('#ul-essential-fill-for-doc').empty();
    //  $('#ul-desired-fill-for-doc').empty();
 }

 function resetJobListingListItems() {
    $('#ul-essential-fill-for-doc').empty();
    $('#ul-desired-fill-for-doc').empty();
 }

function generateWord() {
    resetStaticElements();
    assignTextFields();
    $('.word-content').wordExport('Automatic Job Listing');
    resetJobListingListItems();
}

function generatePDF() {
    resetStaticElements();
    assignTextFields();
    generatePDFWindow();
}

 // EVENT HANDLERS
 $('#word-export-button').click(function (events) {
     generateWord();
 });

 $('#pdf-export-button').click(function (events) {
     generatePDF();
 });

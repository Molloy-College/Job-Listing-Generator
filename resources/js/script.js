 margins = {
     top: 70,
     bottom: 80, //180
     left: 60,
     width: 485
 };

 generate = function () {
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
     $('#general-fill').append($('#general-input').val());
     
     // TODO:
     $('#essential-1-fill').append($('#essential-1-input').val());
     $('#essential-2-fill').append($('#essential-2-input').val());
     $('#essential-3-fill').append($('#essential-3-input').val());
     $('#essential-4-fill').append($('#essential-4-input').val());
     $('#essential-5-fill').append($('#essential-5-input').val());
     $('#essential-6-fill').append($('#essential-6-input').val());
     
     // TODO:
     $('#desired-1-fill').append($('#desired-1-input').val());
     $('#desired-2-fill').append($('#desired-2-input').val());
     $('#desired-3-fill').append($('#desired-3-input').val());
     $('#desired-4-fill').append($('#desired-4-input').val());
     $('#desired-5-fill').append($('#desired-5-input').val());
     $('#desired-6-fill').append($('#desired-6-input').val());

     $('#supervision-fill').append($('#supervision-input').val());
 }

 function resetElements() {
     $('#position-title-top').empty();
     $('#bottom-title').empty();
     $('#department-fill').empty();
     $('#bottom-department').empty();
     $('#bottom-date').empty();
     $('#supervisor-fill').empty();
     $('#hours-fill').empty();
     $('#general-fill').empty();
     $('#essential-fill').empty();
     $('#desired-fill').empty();
     $('#supervision-fill').empty();
 }

 // EVENT HANDLERS
 $('#word-export-button').click(function (events) {
     resetElements();
     assignTextFields();
     $('.word-content').wordExport();
 });

 $('#pdf-export-button').click(function (events) {
     resetElements();
     assignTextFields();
     generate();
 });

// var app = angular.module('myApp', []);

// app.controller('pdfController', ['$scope', function($scope) {
//     $scope.pdfUrl = 'IDP resume.pdf'; // Path to the PDF
//     $scope.searchQuery = '';
//     let pdfDoc = null;
//     let scale = 1.5;
//     let textPositions = [];

//     // Load PDF using PDF.js
//     function loadPDF(url) {
//         pdfjsLib.getDocument(url).promise.then(function(pdf) {
//             pdfDoc = pdf;
//             renderPages();
//         }).catch(function(error) {
//             console.error('Error loading PDF:', error);
//         });
//     }

//     // Render all pages of the PDF
//     function renderPages() {
//         for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
//             pdfDoc.getPage(pageNum).then(page => renderPage(page, pageNum));
//         }
//     }

//     // Render a single page
//     function renderPage(page, pageNum) {
//         let viewport = page.getViewport({ scale: scale });
//         let canvas = document.createElement('canvas');
//         let context = canvas.getContext('2d');
//         canvas.height = viewport.height;
//         canvas.width = viewport.width;
//         canvas.setAttribute('data-page-num', pageNum);
//         document.getElementById('pdf-container').appendChild(canvas);

//         let renderContext = {
//             canvasContext: context,
//             viewport: viewport
//         };

//         page.render(renderContext).promise.then(function() {
//             return page.getTextContent();
//         }).then(function(textContent) {
//             storeTextPositions(textContent, pageNum, viewport);
//         });
//     }

//     // Store the positions of the text on the page
//     function storeTextPositions(textContent, pageNum, viewport) {
//         textContent.items.forEach(function(item) {
//             let transform = pdfjsLib.Util.transform(viewport.transform, item.transform);
//             let x = transform[4];
//             let y = transform[5];
//             let width = item.width * scale;
//             let height = item.height * scale;
//             textPositions.push({ pageNum, text: item.str, x, y, width, height, transform });
//         });
//         console.log(storeTextPositions())
//     }

//     // Search and highlight text
//     $scope.searchText = function() {
//         let query = $scope.searchQuery.toLowerCase();

//         if (!query) {
//             // Clear highlights if the search query is empty
//             clearHighlights();
//             return;
//         }

//         let matches = textPositions.filter(item => item.text.toLowerCase().includes(query));
//         highlightText(matches, query);
//     };

//     // Highlight specific text matches
//     function highlightText(matches, query) {
//         clearHighlights();  // Clear existing highlights first

//         matches.forEach(match => {
//             let canvas = document.querySelector(`#pdf-container canvas[data-page-num="${match.pageNum}"]`);
//             if (canvas) {
//                 let matchText = match.text.toLowerCase();
//                 let context = canvas.getContext('2d');
//                 context.font = `${match.transform[0] * scale}px Arial`;  // Adjust font size based on scale

//                 let startIndex = matchText.indexOf(query);
//                 while (startIndex !== -1) {
//                     // Calculate the width of the highlighted text
//                     let highlightedText = matchText.substring(startIndex, startIndex + query.length);
//                     let textWidth = context.measureText(highlightedText).width;

//                     // Calculate the left position for the highlight
//                     let leftOffset = match.x + context.measureText(matchText.substring(0, startIndex)).width;

//                     // Create highlight layer
//                     let highlightLayer = document.createElement('div');
//                     highlightLayer.classList.add('highlight-layer');
//                     highlightLayer.style.top = (match.y - 5) + 'px';  // Translate highlight up by 5 pixels
//                     highlightLayer.style.left = leftOffset + 'px';
//                     highlightLayer.style.width = textWidth + 'px';
//                     highlightLayer.style.height = match.height + 'px';
//                     highlightLayer.style.position = 'absolute';
//                     highlightLayer.style.backgroundColor = 'yellow';
//                     highlightLayer.style.opacity = 0.5;
//                     highlightLayer.style.pointerEvents = 'none';
//                     canvas.parentNode.appendChild(highlightLayer);

//                     startIndex = matchText.indexOf(query, startIndex + query.length);
//                 }
//             }
//         });
//     }

//     // Clear all highlights
//     function clearHighlights() {
//         let highlights = document.querySelectorAll('.highlight-layer');
//         highlights.forEach(highlight => highlight.remove());
//     }

//     // Initialize PDF loading
//     loadPDF($scope.pdfUrl);
// }]);
var app = angular.module('myApp', []);

app.controller('pdfController', ['$scope', function($scope) {
    $scope.pdfUrl = 'item.pdf'; // Path to the PDF
    $scope.searchQuery = '';
    let pdfDoc = null;
    let scale = 1.5;
    let textPositions = [];

    // Load PDF using PDF.js
    function loadPDF(url) {
        pdfjsLib.getDocument(url).promise.then(function(pdf) {
            pdfDoc = pdf;
            renderPages();
        }).catch(function(error) {
            console.error('Error loading PDF:', error);
        });
    }

    // Render all pages of the PDF
    function renderPages() {
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            pdfDoc.getPage(pageNum).then(page => renderPage(page, pageNum));
        }
    }

    // Render a single page
    function renderPage(page, pageNum) {
        let viewport = page.getViewport({ scale: scale });
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.setAttribute('data-page-num', pageNum);
        document.getElementById('pdf-container').appendChild(canvas);

        let renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext).promise.then(function() {
            return page.getTextContent();
        }).then(function(textContent) {
            storeTextPositions(textContent, pageNum, viewport);
        });
    }

    // Store the positions of the text on the page
    function storeTextPositions(textContent, pageNum, viewport) {
        textContent.items.forEach(function(item) {
            let transform = pdfjsLib.Util.transform(viewport.transform, item.transform);
            let x = transform[4];
            let y = transform[5];
            let width = item.width * scale;
            let height = item.height * scale;
            textPositions.push({ pageNum, text: item.str, x, y, width, height, transform });
        });
        console.log(textPositions); // Display the values in the console

    }

    // Search and highlight text
    $scope.searchText = function() {
        let query = $scope.searchQuery.toLowerCase();

        if (!query) {
            // Clear highlights if the search query is empty
            clearHighlights();
            return;
        }

        let matches = textPositions.filter(item => item.text.toLowerCase().includes(query));
        highlightText(matches, query);
    };

    // Highlight specific text matches
    function highlightText(matches, query) {
        clearHighlights();  // Clear existing highlights first

        matches.forEach(match => {
            let canvas = document.querySelector(`#pdf-container canvas[data-page-num="${match.pageNum}"]`);
            if (canvas) {
                let matchText = match.text.toLowerCase();
                let context = canvas.getContext('2d');
                context.font = `${match.transform[0] * scale}px Arial`;  // Adjust font size based on scale

                let startIndex = matchText.indexOf(query);
                while (startIndex !== -1) {
                    // Calculate the width of the highlighted text
                    let highlightedText = matchText.substring(startIndex, startIndex + query.length);
                    let textWidth = context.measureText(highlightedText).width;

                    // Calculate the left position for the highlight
                    let leftOffset = match.x + context.measureText(matchText.substring(0, startIndex)).width;

                    // Create highlight layer
                    let highlightLayer = document.createElement('div');
                    highlightLayer.classList.add('highlight-layer');
                    highlightLayer.style.top = (match.y - 5) + 'px';  // Translate highlight up by 5 pixels
                    highlightLayer.style.left = leftOffset + 'px';
                    highlightLayer.style.width = textWidth + 'px';
                    highlightLayer.style.height = match.height + 'px';
                    highlightLayer.style.position = 'absolute';
                    highlightLayer.style.backgroundColor = 'yellow';
                    highlightLayer.style.opacity = 0.5;
                    highlightLayer.style.pointerEvents = 'none';
                    canvas.parentNode.appendChild(highlightLayer);

                    startIndex = matchText.indexOf(query, startIndex + query.length);
                }
            }
        });
    }

    // Clear all highlights
    function clearHighlights() {
        let highlights = document.querySelectorAll('.highlight-layer');
        highlights.forEach(highlight => highlight.remove());
    }

    // Initialize PDF loading
    loadPDF($scope.pdfUrl);
}]);

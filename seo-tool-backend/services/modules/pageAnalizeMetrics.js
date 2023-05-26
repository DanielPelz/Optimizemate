 async function getResponseTime(response, numRequests) {
     let totalResponseTime = 0;

     for (let i = 0; i < numRequests; i++) {
         const startTime = Date.now();
         await response;
         const endTime = Date.now();
         const responseTime = endTime - startTime;
         totalResponseTime += responseTime;
     }

     const averageResponseTime = totalResponseTime / numRequests;


     return {
         averageResponseTime
     };
 }

 async function getGzip(response) {
     return response.headers()['content-encoding'] === 'gzip';
 }


 async function getCssFiles($) {
     const stylesheets = $('link[rel="stylesheet"]').length;
     return stylesheets;
 }

 async function getJsFiles($) {
     const scripts = [];
     const scriptElements = $('script[src]');

     scriptElements.each(function() {
         const script = {
             src: $(this).attr('src'),

         };
         scripts.push(script);
     });

     return {
         length: scripts.length,
         scripts: scripts
     };
 }
 module.exports = {
     getResponseTime,
     getGzip,
     getCssFiles,
     getJsFiles,
 }
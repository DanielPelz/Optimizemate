 async function getInternalLinks($, page, url) {
     try {
         await page;
     } catch (error) {
         console.log(`Failed to load ${url}: ${error.message}`);
         return [];
     }


     const internalLinks = new Set();
     const domain = new URL(url).origin;
     const exclude = ['mailto:', 'tel:', 'javascript:', "/wp-content/", "/wp-admin/", "/wp-login.php", "/wp-logi", "#"];

     function normalizeUrl(url) {
         // Entfernen des Schrägstrichs am Ende der URL und Konvertieren in Kleinbuchstaben
         return url.replace(/\/$/, '').toLowerCase();
     }

     $('a[href]').each((index, element) => {
         const href = $(element).attr('href');
         let absoluteUrl;
         try {
             absoluteUrl = new URL(href, url).toString();
         } catch (e) {
             console.error(`Invalid URL: ${href}`);
             return; // Skip this URL
         }
         const normalizedUrl = normalizeUrl(absoluteUrl);

         // Prüfen, ob die URL zur aktuellen Domain gehört und keiner der auszuschließenden Begriffe enthalten ist
         if (normalizedUrl.startsWith(domain) && !exclude.some(ex => normalizedUrl.includes(ex))) {
             // Die URL ist intern (entweder absolut oder relativ) und wird zum Set hinzugefügt
             internalLinks.add(normalizedUrl);
         }
     });

     return Array.from(internalLinks);
 }

 module.exports = { getInternalLinks };
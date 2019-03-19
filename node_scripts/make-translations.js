const cheerio = require('cheerio');
const fs = require('fs');
const tempTranslationsFile = './node_scripts/translations.js';

function changeJs() {
    return new Promise(resolve => {
        fs.readFile('assets/js/translations.js', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            const result = data.replace(/const bitdust_translations = {/g, 'const bitdust_translations = module.exports = {');

            fs.writeFile(tempTranslationsFile, result, 'utf8', function (err) {
                if (err) return console.log(err);
            });

            fs.readFile('./index_new.html', function (err, data) {
                if (err) throw err;
                resolve(data);
            });

        });
    });
}

changeJs().then(data => {
    const translations = require('./translations');

    const $ = cheerio.load(data);
    let html = $('[data-content]');

    for (let key in html) {
        if (html[key].type === 'tag') {
            console.log(translations.en[html[key].attribs['data-content']]);
            $(html[key]).text(translations.en[html[key].attribs['data-content']]);
        }
    }

    saveFile($.html());
    removeTempTranslations();
});

function removeTempTranslations() {
    try {
        fs.unlinkSync(tempTranslationsFile)
    } catch (err) {
        console.error(err)
    }
}

function saveFile(file) {
    fs.writeFile('./test.html', file, function (err) {
        if (err) throw err;
        console.log('Index generated');
    });
}

import jsdom from 'jsdom';
import fetch from 'node-fetch';
const { JSDOM } = jsdom;

export async function webscraper(req, res) {
  let scrapeURL = decodeURIComponent(req.url.split('?')[1]);
  res.statusCode = 200;

  let rawHTML = (await (await fetch(scrapeURL)).text());
  let dom = new JSDOM(rawHTML);
  let document = dom.window.document;
  const extra_tags = document.querySelectorAll('head,link,meta,style,script');
  const extra_tags_length = extra_tags.length;
  for (let i = 0; i < extra_tags_length; i++) {
    try {

      extra_tags[i].remove();

    } catch (e) { continue; }
  }
  let text = dom.window.document.body.textContent;
  text = text.replaceAll('\n', ' ').replaceAll('\t', ' ').replaceAll('\r', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ').replaceAll('\n', ' ').replaceAll('\t', ' ').replaceAll('\r', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ');


  let words = text.split(' ');
  let words_length = words.length;
  text = '';

  for (let i = 0; i < words_length; i++) {
    let word = words[i].trim();
    if (word.length > 0) {
      text = text + word + ' ';
    }
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.end(text);

}

export async function wsPackage(req, res) {

  let scrapeURL = decodeURIComponent(req.url.split('?')[1]);
  res.statusCode = 200;

  let rawHTML = (await (await fetch(scrapeURL)).text());
  let dom = new JSDOM(rawHTML);
  let document = dom.window.document;
  const extra_tags = document.querySelectorAll('head,link,meta,style,script');
  const extra_tags_length = extra_tags.length;
  for (let i = 0; i < extra_tags_length; i++) {
    try {

      extra_tags[i].remove();

    } catch (e) { continue; }
  }
  let text = dom.window.document.body.textContent;
  text = text.replaceAll('\n', ' ').replaceAll('\t', ' ').replaceAll('\r', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ').replaceAll('\n', ' ').replaceAll('\t', ' ').replaceAll('\r', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ').replace(/[?!¿¡.;]/g, '.');

  let words = text.split(' ');
  let words_length = words.length;
  text = '';

  for (let i = 0; i < words_length; i++) {
    let word = words[i].trim();
    if (word.length > 0) {
      text = text + word + ' ';
    }
  }

  let textPacks = [];

  let textChunks = text.split('.');

  let chunk = '';

  while (textChunks.length > 0) {
    while ((chunk.length < 500) && (textChunks.length > 0)) {
      chunk = chunk + textChunks.shift().trim() + '.';
    }
    textPacks.push(chunk);
    chunk = '';
  }

  return JSON.stringify(textPacks);


}


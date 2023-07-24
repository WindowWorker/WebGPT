import './fuzzy-fetch.js';
  globalThis.JSONExtract=function (raw, key) {

    let json_key = '"' + key + '"';
    let json_val = raw.split(json_key)[1].split('"')[1];

    return json_val;


  }

globalThis.LoadCSE = async function (cx) {

    let cxurl = '/cse.js?hpg=1&cx=' + cx;

    let script_raw = await fetchText(cxurl);

    let cse_tok = JSONExtract(script_raw, "cse_token");

    localStorage.setItem(cx, cse_tok);
  };

  globalThis.cseFetchQuery = async function (query,cx) {


    let cse_tok = localStorage.getItem(cx);

    let cse_url = '/cse/element/v1?rsz=filtered_cse&num=10&hl=en&source=gcsc&gss=.com&cx=' + cx + '&q=' + encodeURIComponent(query) + '&safe=off&cse_tok=' + cse_tok + '&lr=&cr=&gl=&filter=1&sort=&as_oq=&as_sitesearch=&exp=csqr,cc&cseclient=hosted-page-client&callback=google.search.cse.api';
    let preslice = (await fetchText(cse_url)).split('google.search.cse.api(')[1]
    let cse_res = tryJSONRu(preslice.slice(0, preslice.length - 2));

    let text = '';
    const results = cse_res;
    const results_length = results.length;
    for (let i = 0; i < results_length; i++) {
      text = text + results[i].url + ' ';
      text = text + results[i].contentNoFormatting;
    }
    return text.split('https://');
  }


  globalThis.cseFetchQueryDeep = async function (query,cx) {


    let cse_tok = localStorage.getItem(cx);

    let cse_url = '/cse/element/v1?rsz=filtered_cse&num=3&hl=en&source=gcsc&gss=.com&cx=' + cx + '&q=' + encodeURIComponent(query) + '&safe=off&cse_tok=' + cse_tok + '&lr=&cr=&gl=&filter=1&sort=&as_oq=&as_sitesearch=&exp=csqr,cc&cseclient=hosted-page-client&callback=google.search.cse.api';
    let preslice = (await fetchText(cse_url)).split('google.search.cse.api(')[1]
    let cse_res = tryJSONRu(preslice.slice(0, preslice.length - 2));

    let text = '';
    const results = cse_res;
    const results_length = results.length;
    let deepResults=[];
    for (let i = 0; i < results_length; i++) {
      deepResults.push(fetchText('/webscraper?'+encodeURIComponent(results[i].url)));
    }
    await Promise.all(deepResults);
        for (let i = 0; i < results_length; i++) {
      text = text + results[i].url + ' ';
      let t = (await deepResults[i]).replace(/https:\/\//gi,'');
          if(t.length>500){t=t.slice(0,500);}
      text = text + t;
    }
    
    return text.split('https://');
  }

  globalThis.fetchText = async function (url, options) {
    let txt = "";
    try {
      txt = await (await fetch(url, options)).text();
    } catch (e) {
      txt = e.message;
    }
    return txt;
  }

globalThis.tryJSON=function (obj) {

    let txt = {};
    try {
      txt = JSON.parse(obj);
    } catch (e) {
      txt = e.message;
    }
    return txt;

  }


 globalThis.tryJSONRes = function (obj) {

    let txt = {};
    try {
      txt = JSON.parse(obj).response;
    } catch (e) {
      txt = e.message;
    }
    return txt;

  }

  globalThis.tryJSONRu = function (obj) {

    let txt = {};
    try {
      txt = JSON.parse(obj).results;
    } catch (e) {
      txt = obj;
    }
    return txt;

  }
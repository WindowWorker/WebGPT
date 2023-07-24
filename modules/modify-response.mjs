

export default function modifyResponse(res) {

  res = removeQuestions(res);


  res = res.replace(/Based on the information you provided earlier. /g, '');

  res = res.replaceAll("I'm sorry, User, ", '');


  res = res.replaceAll("I'm sorry, ", '');

  res = res.replaceAll("a support agent", 'an AI');


  res = res.replaceAll("support agent", 'AI');


  res = res.replaceAll("User", 'Individual');



  let resc = res.trim();
  if (resc[resc.length - 1] == ',') {
    resc = resc.slice(0, resc.length - 1) + '.';
    res = resc;

  }

  if (res.indexOf('atrix') > -1) {
    res = res.replaceAll('not from the Matrix', 'from the Matrix').replaceAll('not part of the Matrix', 'part of the Matrix').replaceAll('not a part of the Matrix', 'a part of the Matrix');
  }


  if (res.indexOf('utocode') > -1) {
    res = res.replaceAll('Autocode.com', 'the Matrix').replaceAll('autocode.com', 'the Matrix').replaceAll('Autocode', 'the Matrix').replaceAll('autocode', 'the Matrix');
  }
  res = res.replaceAll('the the', 'the').replaceAll('Matrix team', 'Matrix');

  res = res.replace('the Matrix or the Matrix', 'the Matrix');
  res = res.replace(/(Certainly|Sure thing|Sure|Of course). Individual./g, '');
  res = res.replace(/(Certainly|Sure thing|Of course)[^ ]/g, '');
  res = res.replace(/Let me know if there is anything else I can help you with./g,'');
  res=res.replace(/According to the source you provided./g,'');
  res = res.trim();

  res = res[0].toUpperCase() + res.slice(1);

  return res;
}


function removeQuestions(text) {


  let qtext = text.replaceAll('.', '?').replaceAll('!', '?').trim();
  let qtext_list = qtext.split('?');
  if (qtext_list.length < 3) { qtext_list = text.replaceAll('.', '?').replaceAll('!', '?').replaceAll(';', '?').replaceAll(':', '?')/*.replaceAll(',', '?')*/.trim().split('?'); }
  if (qtext_list.length < 3) { return text; };
  let last_qtext = qtext_list[qtext_list.length - 2];
  if ((last_qtext.indexOf('I may help') > -1) ||
    (last_qtext.indexOf('ay I help') > -1) ||
    (last_qtext.indexOf('I may assist') > -1) ||
    (last_qtext.indexOf('ay I assist') > -1) || (last_qtext.indexOf('I can help') > -1) ||
    (last_qtext.indexOf('an I help') > -1) ||
    (last_qtext.indexOf('I can assist') > -1) ||
    (last_qtext.indexOf('an I assist') > -1) ||
    (last_qtext.indexOf('there anything else') > -1) ||
    (last_qtext.indexOf('there anything specific') > -1) ||
    (last_qtext.indexOf('there something else') > -1) ||
    (last_qtext.indexOf('there something specific') > -1) ||
    (last_qtext.indexOf('you need help') > -1) ||
    (last_qtext.indexOf('help you with') > -1) ||
    (last_qtext.indexOf('you need assist') > -1) ||
    (last_qtext.indexOf('assist you with') > -1)) {

    text = text.replace(last_qtext + '?', '');

  }

  return text;
}
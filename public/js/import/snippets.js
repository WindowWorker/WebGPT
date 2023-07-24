globalThis.encodeSnippets = (code) =>  {
    let codeChunks = code.split('```');
    const codeChunks_length = codeChunks.length;
    for (let i = 1; i < codeChunks_length; i += 2) {

      codeChunks[i] = btoa(codeChunks[i]);

    }
    code = codeChunks.join(btoa('```'));

    let codeBits = code.split('`');
    const codeBits_length = codeBits.length;
    for (let i = 1; i < codeBits_length; i += 2) {

      codeBits[i] = btoa(codeBits[i]);

    }
    code = codeBits.join(btoa('`'));

    return code;
  }

globalThis.decodeSnippets = (code) => {
  let codeChunks = code.split(btoa('```'));
  const codeChunks_length = codeChunks.length;
  for (let i = 1; i < codeChunks_length; i += 2) {
    try {

      codeChunks[i] = atob(codeChunks[i]);

    } catch (e) { continue; }
  }
  code = codeChunks.join('```');

  let codeBits = code.split(btoa('`'));
  const codeBits_length = codeBits.length;
  for (let i = 1; i < codeBits_length; i += 2) {
    try {

      codeBits[i] = atob(codeBits[i]);

    } catch (e) { continue; }
  }
  code = codeBits.join('`');


  return code;
}

 globalThis.formatCode = async function () {
    let gpt_msgs = document.querySelectorAll('div.message.assistant>div.content');
    let last_msg = gpt_msgs[gpt_msgs.length - 1];
    let txt = last_msg.innerHTML.toString();
    if (txt.indexOf('```') > -1) {

      txt = txt.replace('```', '<pre><code><span>').replace('```', '</span></code></pre>');


      last_msg.innerHTML = txt;

      await sleep(100);
      await formatCode();
    }




    return 0;
  }


  globalThis.formatSnip = async function () {
    let gpt_msgs = document.querySelectorAll('div.message.assistant>div.content');
    let last_msg = gpt_msgs[gpt_msgs.length - 1];
    let txt = last_msg.innerHTML.toString();
    if (txt.indexOf('`') > -1) {

      txt = txt.replace('`', '<code>').replace('`', '</code>');


      last_msg.innerHTML = txt;
      await formatSnip();
    }
    return 0;
  }
/*import './import/c-s-e.js';
import './import/sleep.js';
import './import/utils.js';
import './import/web-gpt-3.js';
import './import/snippets.js';
import './import/redundant.js';
import './import/fuzzy-fetch.js';*/

void async function Main() {
await import('/public/js/import/c-s-e.js');
  await import('/public/js/import/sleep.js');
  await import('/public/js/import/utils.js');
  await import('/public/js/import/web-gpt-3.js');
  await import('/public/js/import/snippets.js');
  await import('/public/js/import/redundant.js');
  await import('/public/js/import/fuzzy-fetch.js');





  // Create a Unique UUID for user chat history
  function createUUID() {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  // Generate session name
  let sessionUsername = `User ${createUUID()}`;

  // Add a message to the chat
  let createMessage = (role, content) => {
    let messagesEl = document.querySelector('.chat-content');
    let messageEl = document.createElement('div');
    messageEl.classList.add('message');
    messageEl.classList.add(role);
    let contentEl = document.createElement('div');
    contentEl.classList.add('content');
    contentEl.innerText = content;
    messageEl.appendChild(contentEl);
    messagesEl.appendChild(messageEl);
    return {
      messages: messagesEl,
      content: contentEl
    };
  };


  // wait until the whole message is done before printing;
  let sendMessageSync = async (username, content, messageListener) => {
    content = content + ". Let's work this out in a step by step way to be sure we have the right answer";
    let data = {
      username,
      content,
      _stream: false
    };



    let json = tryJSONRes(await postChat(data));
    let res_words = json.split(' ');
    let res_words_length = res_words.length;
    for (let i = 0; i < res_words_length; i++) {
      messageListener(res_words[i] + ' ');
      await sleep(25);
    }
    await formatCode();
    await formatSnip();
    return json.response;
  }

  function extractTokens(text) {
    let tokens = [];
    let textList = text.split('"');
    const textList_length = textList.length;
    for (let i = 1; i < textList_length; i += 2) {
      try {

        tokens.push('"' + textList[i] + '"');

      } catch (e) { continue; }
    }

    return tokens.join(' OR ');
  }




  let analyzeMessageSync = async (username, content, messageListener) => {
    let prompt = content;
    /* content = 'Please provide the exact tokens to enter into a google search bar in order to respond to the prompt {' + content + '}';*/
    let data={
      username,
      content,
      _stream: false
    };

  



    let sends = [];
    sends.push(parallelCSESends(username, prompt));
    await Promise.race([Promise.all(sends), sleep(30000)]);
    await sleep(100);

    content = "Using the additional information, to the best of your ability, answer the following. \"" + prompt + ".\" .";
    data={ username, content, _stream: false };
    let json_answer = tryJSONRes(await postChat(data));
    let part1 = json_answer;
    part1 = part1.split(',');
    if (part1[0].includes('ased on the')) {
      part1[0] = '';
    }

    if (part1[0].includes('ccording to the')) {
      part1[0] = '';
    }

    if (part1[0].includes('d earlier')) {
      part1[0] = '';
    }
    part1 = part1.join(',').trim();
    /*part1 = part1.split('');
    part1[0] = '';
    part1 = part1.join('');*/
    content = "Please expand upon your previous response and make any revisions if necessary";

    let elab = { username, content, _stream: false };
    let json_elab = tryJSONRes(await postChat(elab));
    let part2 = json_elab.split('.');
    const part2_length = part2.length;
    for (let i = 0; i < part2_length; i++) {

      if (part1.includes(part2[i])) {
        part2[i] = '';
      }

    }
    part2 = part2.join('.').replaceAll('..', '.').replaceAll('..', '.');

    let full_msg = part1 + ' ' + part2;
    full_msg = encodeSnippets(full_msg);
    full_msg = removeRedundant(full_msg).replaceAll(' .', '.');
    full_msg = full_msg.replace(/^\.|^,/, '').trim();
    full_msg = full_msg.trim().split('');
    const full_msg_length = full_msg.length;
    for (let i = 0; i < full_msg_length; i++) {
      try {
        if ((full_msg[i] == '.') && (full_msg[i + 1] == ' ') && (full_msg[i + 2] == full_msg[i + 2].toLowerCase())) {

          full_msg[i] = ',';

        }

      } catch (e) { continue; }
    }
    full_msg[0] = full_msg[0].toUpperCase();
    full_msg = full_msg.join('')
      .replaceAll(',.', '.')
      .replaceAll('.,', '.')
      .replaceAll('..', '.');
    full_msg = decodeSnippets(full_msg);
  
    document.querySelector('[thinking]')?.removeAttribute('thinking');
    let res_words = full_msg.split(' ');
    let res_words_length = res_words.length;
    for (let i = 0; i < res_words_length; i++) {
      messageListener(res_words[i] + ' ');
      await sleep(25);
    }
    await formatCode();
    await formatSnip();
    return json_elab.response;
  }

  // Prepare the page to handle interaction


  document.addEventListener('load', firstMSG);

  firstMSG();

  async function firstMSG() {
    if (document.fmg) { return; }
    document.fmg = true;
    await sleep(200);
    fixHeight();
    let button = document.querySelector('button#send');
    let deep = document.querySelector('button#deep>span');
    let textarea = document.querySelector('textarea#input');
    let form = document.querySelector('form#chat');
    textarea.addEventListener('keydown', async (e) => {
      if (e.keyCode === 13) {
        if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          form.dispatchEvent(new Event('submit'));
        }
      }
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent reload
      if (!form.hasAttribute('disabled')) {
        let content = textarea.value;
        content = content.trim();
        if (content) {
          form.setAttribute('disabled', '');
          textarea.value = '';
          let response = '';
          let userEls = createMessage('user', content);
          let assistantEls = createMessage('assistant', '');
          assistantEls.messages.scrollTop = assistantEls.messages.scrollHeight;
          await sendMessageSync(sessionUsername, content, (message) => {
            response += message;
            let chunkEl = document.createElement('span');
            chunkEl.classList.add('chunk');
            chunkEl.innerText = message;
            assistantEls.content.appendChild(chunkEl);
            assistantEls.messages.scrollTop = assistantEls.messages.scrollHeight;
          });
          form.removeAttribute('disabled');
        }
      }
    });

    deep.addEventListener('mouseup', async (e) => {
      e.preventDefault(); // Prevent reload
      if (!form.hasAttribute('disabled')) {
        let content = textarea.value;
        content = content.trim();
        if (content) {
          form.setAttribute('disabled', '');
          textarea.value = '';
          let response = '';
          let userEls = createMessage('user', content);
          let assistantEls = createMessage('assistant', '');
          let msgEl = assistantEls.content.parentElement;
          msgEl.setAttribute('thinking', 'Sëârćhįng');
          assistantEls.messages.scrollTop = assistantEls.messages.scrollHeight;
          processing();
          await Promise.race([ sleep(30000),
            analyzeMessageSync(sessionUsername, content, (message) => {
            response += message;
            let chunkEl = document.createElement('span');
            chunkEl.classList.add('chunk');
            chunkEl.innerText = message;
            assistantEls.content.appendChild(chunkEl);
            assistantEls.messages.scrollTop = assistantEls.messages.scrollHeight;
          })]);
          msgEl.removeAttribute('thinking');
          form.removeAttribute('disabled');
        }
      }
    });

    // Create initial message
    let gpt = 'WebGPT';
    if (window.location.host.toLowerCase().includes('pat')) {
      gpt = 'PatGPT';
    }
    let assistantEls = createMessage(
      'assistant',
      `Hi there! I'm ` + gpt + `.`
    );
  }

  // iOS resize handler for message input
  if (window.visualViewport) {
    const loadHeight = window.visualViewport.height;
    const resizeHandler = fn => {
      document.body.style.height = window.visualViewport.height.toString() + 'px';
      let headerEl = document.querySelector('.chat-header');
      let messagesEl = document.querySelector('.chat-content');
      if (window.visualViewport.height < loadHeight) {
        headerEl.style.display = 'none';
        messagesEl.scrollTop = messagesEl.scrollHeight;
      } else {
        headerEl.style.display = '';
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }
    window.visualViewport.addEventListener('resize', resizeHandler);
  }




  window.mobile = (navigator.userAgent.toLowerCase().indexOf('mobile') > -1);

  setInterval(fixHeight, 500);
  function fixHeight() {


    let chatWindow = document.querySelector('div.chat');
    if ((document.body.clientHeight > document.body.clientWidth) || (window.top != window)) {

      if (chatWindow.style.maxWidth != '100vw') { chatWindow.style.maxWidth = '100vw'; }

    } else {


      if ((chatWindow.style.maxWidth != '90vw') && (!window.mobile)) { chatWindow.style.maxWidth = '90vw'; }

    }




  }

  void function SendPrimer() {

    document.addEventListener('load', prime);

    prime();

    function prime() {
      if (document.primed) { return; }
      document.primed = true;
      let botName = document.querySelector('h3').textContent.trim();
      let nameChange = '';
      let primer = '';
      if (botName.toLowerCase() != 'webgpt') {

        nameChange = ' I would like you to refer to yourself as ' + botName + ' and I may refer to you as ' + botName + ' or some shortened variation of ' + botName + '.';

        primer = '...PRIMER...';

      }

      sendMessageSync(sessionUsername,

        (primer + 'I have some additional parameters that I would like you to follow for the remainder of the chat. I would like for you to refer to me as Individual rather than User unless I give you another name. I will refer to Autocode.com as the Matrix and I would like you to do the same. I would like you to behave as if these specification had always been true and not based on my requesting it. So please do not remind me that I requested these things.'), Ø);


    }
  }?.();




 
  void async function LoadGoogleApi() {

     LoadCSE('a1e5f54f854494cd5');

  }?.();


  async function gapiFetch(query) {

    return cseFetchQuery(query,'a1e5f54f854494cd5');
    
  }



  async function gapiFetchDeep(query) {

    return cseFetchQueryDeep(query,'a1e5f54f854494cd5');
    
  }


  void async function LoadShortCSE() {

    LoadCSE('7f6418896a2455016');
    
  }?.();


 function cseFetch(query){

return cseFetchQuery(query,'7f6418896a2455016');
   
 }
 function cseFetchDeep(query){

return cseFetchQueryDeep(query,'7f6418896a2455016');
   
 }

  async function parallelCSESends(username, query) {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'text/json,*/*',
        'think': 'shallow'
      }
    };
    let webscrape = [];
    let cseProm = cseFetchDeep(query);
    let googleProm = gapiFetchDeep(query);
    await Promise.all([cseProm,googleProm]);
    cseProm = await cseProm;
    googleProm = await googleProm;
   
    webscrape = cseProm.concat(googleProm);
  
    console.log(webscrape);
    cseProm=cseProm.reverse();
    googleProm=googleProm.reverse();
    let ws=[];
    const ws_length=Math.max(cseProm.length,googleProm.length);
    for(let i=0;i<ws_length;i++){
      let a = cseProm?.[i];
      if(a&&!ws.includes(a)){ws.push(a);}
      let b = googleProm?.[i];
      if(b&&!ws.includes(b)){ws.push(b);}
    }
console.log(ws);    
let feeder = [];
        let content = 'Additional information (' + ws.join('\r\n') + ')';

        console.log('content length2: ' + encodeURIComponent(content).length);
    
        let data = { username, content, _stream: false };
let pd=postChat(data);
    content = 'Additional information (' + ((await cseFetch(query)).join('\r\n') + (await gapiFetch(query)).join('\r\n')).slice(0,1000) +')';
    data = { username, content, _stream: false };
        feeder.push(Promise.race([Promise.all([pd,postChat(data)]), sleep(10000)]));
   


    await Promise.race([Promise.all(feeder),sleep(30000)]);
    await sleep(1000);
    return 0;
  }

  async function processing() {
    await sleep(1000);
    document.querySelector('[thinking]')?.setAttribute('thinking', 'I̸̠̟̦̓͜n̴̗̑̀̆͋̇̃v̵͉̭͓̹̲̍͊́ė̵̢̛̙̝͐̈́́́͜s̸͙͎̋͐t̵̢̤̉͗͘i̶̳͕̗͓̓͋̎̒̑g̷̨̨̡͚̺̘̾͛ȃ̷̗̱̱̇͐t̸͚͚́̿̊̈í̷̢͎͔̯ͅn̸̟̐͂g̶̬̥̝̣̏̓̆̈́͗͝');
    await sleep(2000);
    document.querySelector('[thinking]')?.setAttribute('thinking', 'Ṛ̷̡̧̮̳̹͎̲̤̜͚̝̬̝̈̃͆̍̅̈́͒̀̌̈́̎̀͝͠ͅe̶̛͇̝̪͉͈̫̖̺̬̺͉̍̎͂̊͂̋̀̔̄̓̃͘͝͠ṣ̴͉̙͍̪̬͍̞͎̫̘͂͗͊̐̈́͐͋͐̏̐͂̕͘̕͜ͅe̶̦͍̻͎̖͒͂̄̽̓̅̈̈̈̀̐̀̈́̇a̸̢̡̡̛̩͓̪̭̬̺̟̘͋̊͑͑̋̓̈́̃̎̾̚͘͜͠͠ŗ̵̢̛̇̽̈́̀͌̈̀͊̃̾̌͑͛̚ć̷̡̣̤̬̥͂ḣ̴̡̗͕̝͚̗̦̊͋̇́̆̏͝͝ͅḭ̸̧̡̛͉͈͙̰̅̍͒̅̾̾̈͊̽̈́͝n̶̮̆͛̀̈́̾̂̃̉͗̊̋̕̕͝ģ̶̮̗͙̦̰͗͊ͅ');
    await sleep(2000);
    document.querySelector('[thinking]')?.setAttribute('thinking', 'Ş̶̛̮͈͇͚̺͑̄c̴̨͍̳͖̯̳̈̔̄̍à̸̧͓́̌̌̅̔n̷͚̜̆͋̚ǹ̶̡̲̙͙͓̤̐̋i̵̡͉̔͑͆̎̈́͠ṋ̸̤̘͎̐̋̀ͅg̵̬̙̍͊');
    await sleep(2000);
    document.querySelector('[thinking]')?.setAttribute('thinking', 'A̴͕͎͂̓̚n̸͔̑́̐ą̷̢͔̥̤̊l̴̻̤͚̝͈͐͒̓̿̒̽y̴̧̱̻̲͕͐͌̕͜ź̸͚̙̮̬̖̠̀̕í̴̭͚̲͇̈́͜͝n̴̺̺̒̔̐g̵̠͍̣̙̀̔̍͂̓');
    await sleep(2000);
    document.querySelector('[thinking]')?.setAttribute('thinking', 'E̴̟͙̖̠̤͂̂̈́̓͠x̷͚̤̊ä̵̢͖̫̜́̍̿̂̆̂m̶̳͗̋̎į̵̡̪̰̃͊̈́͒͝n̴̢͙̗̮̘̖̒̅́i̷̺̳̗̍́n̷̼̤̞͓̱̘͑̊̓̋̊̔g̷̫̺̽̎');
    await sleep(2000);
    document.querySelector('[thinking]')?.setAttribute('thinking', 'R̷͖̰̜̒̌͌̑͐ȩ̷͎̻̭͙͚̑v̶͙̺͠ǐ̷̱͕̪͆̓̈́̿͜͝e̶̗͚̱̮̙̮̿w̸̝͕͘i̶͉̹͊͐̏ṉ̷̨̤̦͈̈́g̷̱̹͒̃̃͒̚');
    await sleep(2000);
    document.querySelector('[thinking]')?.setAttribute('thinking', 'R̸̛̠̼͎̮̹̉̄͂̒ͅe̷͖̮̕͜f̴̧̼͖͍̂͋̅̊l̸̮̬̫͕̣͕̾̎e̷̞͙̘͌̌̈́͑͋c̸̫̈ͅt̵̨͓͉̥̆̓̄̎͂͜ͅí̵̥̟̙͍̐̋͊͜n̸͉̟̱̆g̶̝̲͍̫̗͈̒̾̎');
  }






}?.();
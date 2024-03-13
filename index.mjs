import fetch from 'node-fetch';
import http from 'http';
import modifyResponse from './modules/modify-response.mjs';
import modifyRequest from './modules/modify-request.mjs';
import { webscraper, wsPackage } from './modules/webscraper.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import maintain from './modules/auto-maintain.mjs';
import {availReq,availRes} from './modules/availability.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//console.log(__dirname);
const base20 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const webgptId = __dirname.split('WebGPT')?.[1] || 0;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

let server = http.createServer(availReq(onRequest));


server.listen(3000);

maintain(server);

async function onRequest(req, res) {
 res=availRes(res);
    let path = req.url.replaceAll('*', '');
    let pat = path.split('?')[0].split('#')[0];
    if (pat == '/ping') {
    
      res.statusCode = 200;
      return res.endAvail();
    }



    if (req.url.indexOf('/webscraper?') == 0) {

      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.endAvail(await webscraper(req, res));

    }

        if (req.url.indexOf('/wsPackage?') == 0) {

      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.endAvail(await wsPackage(req, res));

    }

    if ((req.url.includes('cse.js')) || (req.url.includes('cse') && req.url.includes('element') && req.url.includes('v1?'))) {

      res.setHeader('Access-Control-Allow-Origin', '*');
      let cseBdy = await (await fetch('https://cse.google.com' + req.url)).text();
      return res.endAvail(cseBdy);

    }

    if (pat == '/chat/') {
      let req_url = req.url;
      if (req.headers['think'] == 'deep') {
        let req_url_list = req_url.split('&content=');
        let reqText = decodeURIComponenet(req_url_list[1].split('&_stream=false')[0]);


        req_url = req_url_list + '&content=' + encodeURIComponent(modifyRequest(reqText)) + '&_stream=false';

      }



      const options = {
        method: 'GET',
        headers: {
          'Accept': 'text/json'
        }
      };

      res.statusCode = 200;
      let resJson = JSON.parse(await (await fetch('https://web-gpt-demo.com/' + req_url, options)).text());
      resJson.response = modifyResponse(resJson.response);
      return res.endAvail(JSON.stringify(resJson));

    }
    let resp=await fetch('https://files-servleteer-vercel-app-six.vercel.app/webgpt'+req.url);
    if(req.url=='/'||req.url==''){req.url='/index.html';}
    let file = Buffer.from(await(resp).arrayBuffer());
  res.setHeader('Content-Type',resp.headers.get('Content-Type'));
    return res.endAvail(file);
}

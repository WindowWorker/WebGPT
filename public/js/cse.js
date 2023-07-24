let cse=document.createElement('script');
cse.src='https://WebGPT-cse.servleteer.repl.co/search-parent.js';
cse.onload = async function(){

await searchAPIWebletReady.promise;

}
  
document.head.appendChild(cse);
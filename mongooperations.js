let db;
let client;
let scripts;

function load(url){
    req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return req.responseText; 
}

function connectMongo(){
    client = new stitch.StitchClient(load('mongoStitch'));
    console.log('load');
    console.log(load('mongoStitch'));
    db = client.service('mongodb', 'mongodb-atlas').db('scriptsOnHand');
    client.login().then(() => {
      console.log('[MongoDB Stitch] Connected to Stitch');
      getAllScripts();
    }).catch(err => {
      console.error(err)
    });
}

function getAllScripts(){
    db.collection('scripts').find({owner_id: client.authedId()}).then(docs => {
        scripts = docs;
        addScriptsToDOM();
        console.log('Found docs', docs);
    }).catch(err => {
        console.error(err)
    });
}

function addScriptsToDOM(){
    let ref = document.querySelector('ul');
    if(ref){
        ref.remove();
    }
    let ul = document.createElement('ul');
    let template = load('templateLI.html');
    scripts.forEach((element) => {
      if(element.script){
        li = document.createElement('li');
        let withInfo = template;
        withInfo = withInfo.replace(new RegExp('SCRIPT_ID', 'g'), element._id.toString());
        withInfo = withInfo.replace('SCRIPT_CODE', element.script);
        withInfo = withInfo.replace('SCRIPT_DESCRIPTION', element.description);
        li.innerHTML = withInfo;
        ul.appendChild(li);
      }
    });
    document.body.appendChild(ul);
}

connectMongo();

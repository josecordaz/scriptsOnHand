let db;
let client;
let scripts;

function connectMongo(func){
    client = new stitch.StitchClient('scriptonhand-twffr');
    db = client.service('mongodb', 'mongodb-atlas').db('scriptOnHand');
    client.login().then(() =>
      db.collection('scripts').updateOne({owner_id: client.authedId()}, {$set:{number:42}}, {upsert:true})
    ).then(()=>
      db.collection('scripts').find({owner_id: client.authedId()})
    ).then(docs => {
      scripts = docs;
      func();
      console.log('Found docs', docs)
      console.log('[MongoDB Stitch] Connected to Stitch')
    }).catch(err => {
      console.error(err)
    });
}

function load(url){
    req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return req.responseText; 
}

function addScriptsToDOM(){
    ul = document.querySelector('ul');
    let template = load('templateLI.html');
    console.log('scripts size'+scripts.length);
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
}

connectMongo(()=>{
    addScriptsToDOM();
});

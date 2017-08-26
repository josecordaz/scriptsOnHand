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
    client.login(load('user'), load('password')).then(() => {
      console.log('[MongoDB Stitch] Connected to Stitch');
      getAllScripts();
    }).catch(err => {
        alert('error = '+error);
    });
}

function getAllScripts(){
    db.collection('scripts').find({owner_id: client.authedId()}).then(docs => {
        scripts = docs;
        addScriptsToDOM();
    }).catch(err => {
        alert('error = '+error);
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

window.saveScript = function(){
    if(document.querySelector('#script-id').value){
        updateScript();
    } else {
        saveNewScrtip();
    }
}

function updateScript(){
    let idDom = document.querySelector('#script-id').value;

    let newScript = document.querySelector('#script-content').value;
    let newDescription = document.querySelector('#script-description').value;

    db.collection('scripts').updateOne(
        {
            _id: { $oid: idDom },
            owner_id : client.authedId()
        },{
            $set : {
                script      : newScript,
                description : newDescription
            }
        }
    ).then((docs) => {
        alert('Script updated');
        updateScriptOnDOM(idDom, newScript, newDescription);
        closeNewScriptForm();
    }).catch((error) => {
        alert('error = '+error);
    });
}

function saveNewScrtip(){
    let objectNew = {
        script       : document.querySelector('#script-content').value,
        description  : document.querySelector('#script-description').value,
        copied       : 0,
        creationDate : new Date(),
        owner_id     : client.authedId()
    };

    db.collection('scripts').insert(objectNew).then((docs) => {
        objectNew._id = docs.insertedIds[0];
        scripts.push(objectNew);
        addNewScriptToDom(docs.insertedIds[0].toString());
        alert('Script saved');
        closeNewScriptForm();
    }).catch((error) => {
        alert('error = '+error);
    });
}

function searchScripts(text){
    db.collection('scripts').find(
        {
            $or:[
                {
                    "script": {
                        $regex:text,
                        $options:'i'
                    }
                },
                {
                    "description": {
                        $regex:text,
                        $options:'i'
                    }
                }
            ]
        }
    )
    .then(docs => {
        scripts = docs;
        addScriptsToDOM();
    }).catch((error) => {
        alert('error = '+error);
    });
}

function deleteScriptById(id,func){
    db.collection('scripts').deleteOne({_id: {$oid: id},owner_id: client.authedId()}).then(()=>{
        func();
    }).catch(error => {
        alert('error = '+error);
    });
}

connectMongo();

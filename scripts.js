window.onload = () =>{
    console.log('ON LOAD');
    var clipboard = new Clipboard('.btn');
    clipboard.on('success', function(e) {
        console.log('success clipboarding');
        e.clearSelection();
    });
};

window.openNewScript = function(){
    let newScript = document.createElement('div');
    newScript.className = 'main-pop-up';
    newScript.id = 'new-script-window';
    newScript.innerHTML = load('newScript.html');
    document.querySelector('body').appendChild(newScript);
}

window.closeNewScriptForm = function(){
    document.querySelector('#new-script-window').remove();
}

window.saveScript = function(){
    db.collection('scripts').insert(
        {
          script: document.querySelector('#script-content').value,
          description:document.querySelector('#script-description').value,
          copied:0,
          creationDate:new Date(),
          owner_id: client.authedId()
        }
    ).then(()=>{
        getAllScripts();
        alert('Script saved');
        closeNewScriptForm();
    }).catch((error)=>{
        alert('error = '+error);
    });
}
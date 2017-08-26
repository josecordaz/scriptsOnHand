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

function addNewScriptToDom(id){
    let li = document.createElement('li');
    let template = load('templateLI.html');
    template = template.replace(new RegExp('SCRIPT_ID', 'g'), id);
    template = template.replace('SCRIPT_CODE', document.querySelector('#script-content').value);
    template = template.replace('SCRIPT_DESCRIPTION', document.querySelector('#script-description').value);
    li.innerHTML = template;
    document.querySelector('ul').insertBefore(li, document.querySelector('li'));
}

function deleteScriptOnDOM(id){
    var r = confirm("You want to delete this item?");
    if (r == true) {
        deleteScriptById(id,()=>{
            document.querySelector('#_'+id).parentElement.parentElement.remove();
        });
    }
}

function openUpdateWindow(id) {
    let update = scripts.find(item => item._id.toString() === id );
    openNewScript();
    document.querySelector('#script-content').value = update.script;
    document.querySelector('#script-description').value = update.description;
    document.querySelector('#script-id').value = update._id.toString();
}

function updateScriptOnDOM(id, script, description) {
    let scriptDOMElement = document.querySelector('#_'+id);
    let descriptionDOMElement = scriptDOMElement.parentElement.nextElementSibling;

    scriptDOMElement.innerHTML = script;
    descriptionDOMElement.innerHTML = description;
}

function clearSearch(){
    document.querySelector('input').value = '';
    getAllScripts();
}

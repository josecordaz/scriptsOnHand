window.onload = () =>{
    var clipboard = new Clipboard('.bodyId');
    clipboard.on('success', function(e) {
        e.clearSelection();
    });
};

window.openNewScript = function(){
    let newScript = document.createElement('div');
    newScript.className = 'main-pop-up';
    newScript.innerHTML = 'PANTALLA EMERGENTE';
    document.querySelector('body').appendChild(newScript);
}
console.log("Index.js is loaded")


function selectUnit(button) {
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    }

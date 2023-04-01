const { Sequelize } = require('sequelize');
var moduleName = 'Sequelize';
require([moduleName], function(fooModule){
    // do something with fooModule
})
const sequelize = new Sequelize('sqlite::memory:') 

function Login() {
    var getusername = document.getElementById("cuname").value;
    var getpassword = document.getElementById("cpsw").value;
    const user = User.findOne({ where: { username: cuname } });
    console.log('salut');
    if (user === null) {
        alert ('aucun utilisateur enregistré avec ce pseudo');
        console.log('pas pseudo');
    } else {
        if (user.password === getpassword) {
            alert ('vous etes connecte');
            window.location.href = "index.html";
        } else {
                alert('le mot de passe ne correspond pas');
         }
      }
};
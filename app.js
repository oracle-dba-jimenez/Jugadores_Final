// Realizado por Ing. Miguel A. Jimenez
// el 25/7/2020

// Inicializa conexion a la DB
firebase.initializeApp({
    apiKey: "AIzaSyDd2R1R8Uzaq3IOnaVclYesjAG1FwWkq9o",
    authDomain: "pruebajs-c1257.firebaseapp.com",
    projectId: "pruebajs-c1257"
});

// Abre la DB
var db = firebase.firestore();


// Carga en tabla los documentos actuales en la DB
(() => {
    // Leer datos

    // Lee tabla para las Aguilas a tablaa
    var tablaa = document.getElementById("tabla_aguilas");
    db.collection("jugadores").where("equipo", "==", "A").onSnapshot((querySnapshot) => {
        // Limpiamos la tabla
        tablaa.innerHTML = '';
        querySnapshot.forEach((doc) => {
            // Formato de los datos en nuestra tabla
            console.log(`${doc.id} => ${doc.data().jugador}`);
            tablaa.innerHTML +=
                `
        <tr>
       <!-- <th scope="row">${doc.id}</th>-->
        <td>
        <input type="checkbox" name="mover[]" value='${doc.id}' /> 
        </td>
        <td>${doc.data().jugador}</td>
        <td>
         <!-- <button type="button" onclick="removeUser('${doc.id}')" class="btn btn-danger">
         Eliminar
         </button> 
         <button type="button" 
         onclick="updateUser('${doc.id}', '${doc.data().equipo}' )"
                  class="btn btn-warning">
         Cambia Equipo
         </button> -->
        </td>
        </tr>
        `;
        });
    });

    // Lee tabla para el Licey a tablal
    var tablal = document.getElementById("tabla_licey");
    db.collection("jugadores").where("equipo", "==", "L").onSnapshot((querySnapshot) => {
        // Limpiamos la tabla
        tablal.innerHTML = '';
        querySnapshot.forEach((doc) => {
            // Formato de los datos en nuestra tabla
            console.log(`${doc.id} => ${doc.data().jugador}, ${doc.data().equipo}`);
            tablal.innerHTML +=
                `
        <tr style="color: white;">
        <!-- <th scope="row">${doc.id}</th> -->
        <td>
        <input type="checkbox" name="mover[]" value='${doc.id}' />
        </td>
        <td>${doc.data().jugador}</td>
        <td>
        <!-- <button type="button" onclick="removeUser('${doc.id}')" class="btn btn-danger">
         Eliminar
         </button> 
         <button type="button" 
         onclick="updateUser('${doc.id}', '${doc.data().equipo}' )"
                  class="btn btn-warning">
         Cambia Equipo
         </button> -->
        </td>
        </tr>
        `;
        });
    });
})();


//////////////////////////////////////////
// FUNCIONES DEL PROGRAMA DE JUGADORES //
/////////////////////////////////////////

// Crea y guarda documentos en la DB
function save() {
    //var jugador = document.getElementById('jugador').value;
    var jugador = validaJugador();
    var equipo = valorRadioButtomEquipo();
    
    if (jugador) {
        console.log(`Jugador:  ${jugador}`);
        console.log(`Equipo:   ${equipo}`);
        db.collection("jugadores").add({
            jugador: jugador,
            equipo: equipo
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                document.getElementById('jugador').value = null;
                document.getElementById('equipo').value = "";
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }
    else
        alert("Jugador no puede estar en blanco");
};

// Llena formulario con datos de la DB de registro a editar
function populateForm(id, jugador) {
    var boton = document.getElementById('boton');
    document.getElementById('jugador').value = jugador;
    document.getElementById('equipo').value = equipo;
    var busca = `${id}`;
    console.log(`El id es: ${id}`);
    console.log(`El id a buscar es: ${busca}`);
    // Cambia propiedades del boton de Guardar
    document.getElementById('boton').setAttribute("onClick", `updateUser('${id}','${equipo}')`);
    boton.innerHTML = 'Guardar Cambios';
};

// Actualiza documentos
function updateUser(id, equipo) {
    console.log(`El id a modificar es: ${id} : ${equipo}`);
    var cambiaEquipo = "";

    if (equipo === "A")
        cambiaEquipo = 'L';
    if (equipo === "L")
        cambiaEquipo = 'A';

    console.log(`El id a modificado es: ${id} : ${equipo}`);
    db.collection("jugadores").doc(id)
        .update({
            //"jugador": document.getElementById('jugador').value,
            "equipo": cambiaEquipo
        })
        .then(function () {
            //alert("Documento actualizado correctamente");
            //document.getElementById('jugador').value = "";
            //document.getElementById('equipo').value = "";
            //document.getElementById('boton').setAttribute("onClick", `save()`);
            //boton.innerHTML = 'Crear Nuevo';
        }).catch(function (error) {
            console.error("Error en actualizacion: ", error);
        });;
};

// Busca todos los jugadores de las Aguilas
function cambiaTodosA() {
    db.collection("jugadores").where("equipo", "==", "A")
        .get()
        .then(snap => {
            snap.forEach(doc => {
                console.log(doc.data());
                console.log(doc.id);
                updateUser(doc.id, doc.data().equipo);
            });
        });
};

// Busca todos los jugadores de los Tigres del Licey
function cambiaTodosL() {
    db.collection("jugadores").where("equipo", "==", "L")
        .get()
        .then(snap => {
            snap.forEach(doc => {
                console.log(doc.data());
                console.log(doc.id);
                updateUser(doc.id, doc.data().equipo);
            });
        });
};

// Borrar documentos
function removeUser(id) {
    db.collection("jugadores").doc(id).delete().then(function () {
        alert("Documento eliminado correctamente");
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
};

// Valida el contenido del radio buttom ids=(equipo1,equipo2) name=equipo 
function valorRadioButtomEquipo() {
    var eqa = document.getElementById('equipo1');
    var eql = document.getElementById('equipo2');

    if (eqa.checked === true) {
        return (eqa.value);
    }
    if (eql.checked === true) {
        return (eql.value);
    }
    else {
        return ("");
    }
};

//  Valida que la entrada del jugador no este en blanco
function validaJugador() {
    var x = document.getElementById('jugador').value;
    if (x.value !== null || x.value.length !== 0)
        return (x);
    //save();
    else {
        alert("Jugador no puede estar en blanco 2");
        return ("JUGADOR SIN NOMBRE");
    }
};

// Busca los jugadores seleccionados para cambio en las Aguilas
function buscaSelecAguilas() {
    var selected = new Array();
    var tablaAguilas = document.getElementById("tabla_aguilas");
    var chks = tablaAguilas.getElementsByTagName("INPUT");
    for (var x = 0; x < chks.length; x++) {
        if (chks[x].checked) {
            selected.push(chks[x].value);
            updateUser(chks[x].value, "A");
        }
    }
};

// Busca los jugadores seleccionados para cambio en los Tigres del Licey
function buscaSelecLicey() {
    var selected = new Array();
    var tablaAguilas = document.getElementById("tabla_licey");
    var chks = tablaAguilas.getElementsByTagName("INPUT");
    for (var x = 0; x < chks.length; x++) {
        if (chks[x].checked) {
            selected.push(chks[x].value);
            updateUser(chks[x].value, "L");
        }
    }
};


//  Fin de las Funciones ////////////////////////////// 
fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then((data) => {
        data.map((res) => {

            let elmPersona = document.getElementById('persona')

            // Crear un elemento `li` para cada propiedad
            let nombre = document.createElement('li');
            nombre.textContent = `Nombre: ${res.nombre}`;
            let edad = document.createElement('li');
            edad.textContent = `Edad: ${res.edad}`;
            let email = document.createElement('li');
            email.textContent = `Email: ${res.email}`;

            // Agregar los nuevos elementos `li` al elemento `ul`
            elmPersona.appendChild(nombre);
            elmPersona.appendChild(edad);
            elmPersona.appendChild(email);
            linea = document.createElement('hr')
            elmPersona.appendChild(linea);
        });
    })
    .catch(error => console.log(error));



async function showID() {
    try {
        const response = await fetch('http://localhost:3000/users/4');
        const json = await response.json();
        console.log('eres fercho o ferchito', json);
    } catch (error) {
        console.log('aun no existes', error);
    }
}

showID();

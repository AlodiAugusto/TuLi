let listaDeSeries = [];

let tuListaDeSeries = [];

let seriesBuscadas = [];

const contenedor = document.getElementById("contenedor"); // Div contenedor general

const cartelera = document.getElementById("cartelera"); // Div contenedor de las series disponibles

const tuLista = document.getElementById("tu-lista"); // Div de las series seleccionadas

const botonSig = document.getElementById("siguiente"); // Boton siguientes series disponibles

const botonAnt = document.getElementById("anterior");

const cantidad = document.getElementById("cantidad");

let input = document.getElementById("buscador");

const serieBuscada = document.getElementById("buscada");

const imagenes = "https://image.tmdb.org/t/p/w500"

let numPag = 1;

let contador = 0;

function buscarSerie() {

    contenedor.addEventListener("keydown", e => {

        if (input.value != "" && e.key === "Enter") {

            const url = "https://api.themoviedb.org/3/search/tv?api_key="

            const apiKey = "b8abc2a29098bd89227225c45829c229"

            const busqueda = `&language=es-MX&page=1&include_adult=false&query=${input.value}`

            fetch(url + apiKey + busqueda).then(response => response.json()).then(serie => {

                listaDeSeries.push(serie.results[0])
                serie = serie.results[0]
                serie.ident = listaDeSeries.length - 1

                if(noEsRepetida(serie, seriesBuscadas)){
                    
                    let serieEncontrada = document.createElement("div")
                    serieEncontrada.id = `busqueda${serie.ident}`
                    serieEncontrada.className = "disponibles"
                    serieEncontrada.innerHTML = `<button class="boton boton-busqueda" onclick="quitarBusqueda(${serieEncontrada.id}, ${serie.ident})">X</button>
                        <img src="${imagenes}${serie.poster_path}" class="portada" onclick="agregarATuLista(${serie.ident})">
                        <h4 class="titulo-busqueda">${serie.name}</h4>`

                   
                    serieBuscada.appendChild(serieEncontrada)
                    seriesBuscadas.push(serie)
                    contador++

                }

            })

        }
    })
}

function quitarBusqueda(id, serieId){

    indiceEncontrado = seriesBuscadas.findIndex(elemento => elemento.ident === serieId)
    busquedaAQuitar = id
    serieBuscada.removeChild(busquedaAQuitar)
    seriesBuscadas.splice(indiceEncontrado, 1)

}

function llamarApi() {

    const url = "https://api.themoviedb.org/3/tv/popular?api_key="

    const apiKey = "b8abc2a29098bd89227225c45829c229"

    const lenguaje = "&language=es-MX"

    for (let i = 0; i < 6; i++) {

        const page = "&page=" + numPag

        numPag++

        fetch(url + apiKey + lenguaje + page).then(response => response.json()).then(data => {

            series = data.results
            series.forEach(serie => {

                listaDeSeries.push(serie)

            });

            if (i == 0) {

                seriesVisibles(listaDeSeries)

            }

        }).catch(err => console.log(err))


    }

}


function tandaDeSeries(desde, hasta, lista) { // Mostrar una tanda de series de la listaDeSeries

    for (let i = desde; i < hasta; i++) {

        serie = lista[i]
        indice = i
        serie.ident = indice
        let seriesEnLista = document.createElement("div")
        seriesEnLista.className = "disponibles"
        seriesEnLista.innerHTML = `<img src="${imagenes}${serie.poster_path}" class="portada" onclick="agregarATuLista(${serie.ident})">
        <h4>${serie.name}</h4>`

        cartelera.appendChild(seriesEnLista)

    };

}

function seriesVisibles(listaDeSeries) { //El evento click para los botones que cambian las imagenes de series

    let inicio = 0 // Primeras series que se muestran
    let final = 6
    let contador = 1
    let cantidadPags = listaDeSeries.length

    cantidad.innerHTML = `${contador} / ${cantidadPags}`

    tandaDeSeries(inicio, final, listaDeSeries);

    contenedor.addEventListener("click", (e) => {

        if (e.target == botonSig && (final != 120)) { // Muestra mas series, hasta las que hay disponibes, es decir 10(el final)

            contador++
            cartelera.innerHTML = null
            inicio += 6
            final += 6
            tandaDeSeries(inicio, final, listaDeSeries)
            cantidad.innerHTML = `${contador} / ${cantidadPags}`

        } else if (e.target == botonAnt && (inicio != 0)) {

            contador--
            cartelera.innerHTML = null
            inicio -= 6
            final -= 6
            tandaDeSeries(inicio, final, listaDeSeries);
            cantidad.innerHTML = `${contador} / ${cantidadPags}`

        } else if (e.target == botonSig && (final == 120)) {

            cartelera.innerHTML = null
            contador = 1
            inicio = 0
            final = 6
            tandaDeSeries(inicio, final, listaDeSeries);
            cantidad.innerHTML = `${contador} / ${cantidadPags}`

        }

    })

}


function verificarSeries() {

    if (localStorage.getItem("series")) {

        tuListaDeSeries = JSON.parse(localStorage.getItem("series"));

        tuListaDeSeries.forEach(serie => {

            serie.calificacion == null ? mostrarTuLista(serie) : mostrarTuListaActualizada(serie)

        });
    }

}

function noEsRepetida(elementoAgregar, lista) { // Verifica tuLista para ver que no haya repetidas, a partir del id de la serie

    indiceEncontrado = lista.findIndex(elemento => elemento.id === elementoAgregar.id)
    return indiceEncontrado === -1

}


function agregarATuLista(indice) { // Esto suma la serie seleccionada a tu lista

    serieAgregar = listaDeSeries[indice];

    if (noEsRepetida(serieAgregar, tuListaDeSeries)) {

        tuListaDeSeries.push(serieAgregar);
        mostrarTuLista(serieAgregar);
        actualizarStorage(tuListaDeSeries);
        Toastify({
            text: `${serieAgregar.name} fue agregada a tu lista`,
            duration: 3000,
            gravity: "top",
            position: "center",
            className: "cartelito",
            style: {
                background: "linear-gradient(to right, #e6b329, #ae830a)",
            }
        }).showToast();


    }
}


function borrarSerie(idCarta, serieId) { // Función que en base al id de la carta la borra, y borra la misma serie de la lista

    cartaBorrar = document.getElementById(idCarta)
    tuLista.removeChild(cartaBorrar)
    indiceEncontrado = tuListaDeSeries.findIndex(serie => serie.id === serieId)
    tuListaDeSeries.splice(indiceEncontrado, 1)
    actualizarStorage(tuListaDeSeries)

}

function calificar(cartaId) {

    let cartaActual = document.getElementById(cartaId)
    idCalificacion = `calificacion ${cartaId}`
    let calificacion = document.getElementById(idCalificacion)
    let calificacionElegida = parseInt(calificacion.options[calificacion.selectedIndex].value);
    let textoCalificacion = document.createElement("p");
    textoCalificacion.className = "textoCalificacion"
    textoCalificacion.innerHTML = `Tu calificación es: ${calificacionElegida}☆`
    textoAQuitar = cartaActual.lastChild
    cartaActual.removeChild(textoAQuitar)
    cartaActual.appendChild(textoCalificacion)

    Toastify({
        text: "Tu calificación fue exitosa",
        duration: 3000,
        gravity: "top",
        position: "center",
        className: "cartelito",
        style: {
            background: "linear-gradient(to right, #e6b329, #ae830a)",
        }
    }).showToast();

    guardarCalificacion(calificacionElegida, cartaId)
    actualizarStorage(tuListaDeSeries)


}

function guardarCalificacion(calificacion, id) {

    indiceEncontrado = tuListaDeSeries.findIndex(serie => serie.ident === id)
    calificacionActual = `Tu calificación es: ${calificacion}☆`
    tuListaDeSeries[indiceEncontrado].calificacion = calificacionActual


}

function mostrarTuListaActualizada(serie) { // Esto crea tu lista para que se vea en html

    let carta = document.createElement("div");
    carta.className = "carta"
    carta.id = serie.ident
    carta.innerHTML = `<button class="boton" onclick="borrarSerie(${carta.id}, ${serie.ident})">Eliminar</button>
        <div><img class="portada-carta" src="${imagenes}${serie.poster_path}"></div>
        <h3>${serie.name}</h3>
        <li>Fecha de inicio: ${serie.first_air_date}</li>
        <li>Idioma original: ${serie.original_language.toUpperCase()}</li>  
        <li>País de origen: ${serie.origin_country}</li>
        <button class="boton" onclick="mostrarSinopsis(${carta.id})">Sinopsis</button>
        <p class="textoCalificacion">${serie.calificacion}</p>`

    tuLista.appendChild(carta)

}


function mostrarTuLista(serie) { // Esto crea tu lista para que se vea en html

    let carta = document.createElement("div");
    carta.className = "carta"
    carta.id = serie.ident
    carta.innerHTML = `<button class="boton" onclick="borrarSerie(${carta.id}, ${serie.ident})">Eliminar</button>
        <div><img class="portada-carta" src="${imagenes}${serie.poster_path}"></div>
        <h3>${serie.name}</h3>
        <li>Fecha de inicio: ${serie.first_air_date}</li>
        <li>Idioma original: ${serie.original_language.toUpperCase()}</li>  
        <li>País de origen: ${serie.origin_country}</li>
        <button class="boton" onclick="mostrarSinopsis(${carta.id})">Sinopsis</button>
        <p> 
            <select class="calificacion" id="calificacion ${carta.id}">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <button class="boton-calif" onclick="calificar(${carta.id})">Calificar</button>
        </p>`

    tuLista.appendChild(carta)

}

function mostrarSinopsis(id) {

    indice = tuListaDeSeries.findIndex(serie => serie.ident == id)

    serie = tuListaDeSeries[indice]

    if (serie.overview == "") {

        Swal.fire({
            html: `<li>Esta serie no tiene sinopsis aun</li>`,
            background: "#1b1e22",
            color: "white",
            confirmButtonColor: "#e6b329"
        })

    } else {

        Swal.fire({
            html: `<h3>${serie.name} Sinopsis</h3>
            <li>${serie.overview}</li>`,
            background: "#1b1e22",
            color: "white",
            confirmButtonColor: "#e6b329"
        })

    }

}

function actualizarStorage(series) { // Actualiza el storage con las series de tuLista

    localStorage.setItem("series", JSON.stringify(series));

};

llamarApi();

buscarSerie();

verificarSeries();
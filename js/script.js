let listaDeSeries =  [
{id:0, nombre: "Breaking Bad",       genero: "Drama, Thriller",          temporadas: "5 temporadas", img: "./img/breakingbad.jpg",},
{id:1, nombre: "Euphoria",           genero: "Drama, Adolescencia",      temporadas: "2 temporadas", img: "./img/euphoria.jpg"},
{id:2, nombre: "Game Of Thrones",    genero: "Fantasía Epica, Politica", temporadas: "7 temporadas", img: "./img/got.jpg"},
{id:3, nombre: "Dr.House",           genero: "Comedia Negra",            temporadas: "8 temporadas", img: "./img/house.jpg"},
{id:4, nombre: "El Marginal",        genero: "Drama, Policial",          temporadas: "4 temporadas", img: "./img/marginal.jpg"},
{id:5, nombre: "Shingeki No Kyojin", genero: "Acción, Seinen",            temporadas: "4 temporadas", img: "./img/shingeki.png"},
{id:6, nombre: "Silicon Valley",     genero: "Comedia, Sátira",          temporadas: "3 temporadas", img: "./img/siliconvalley.jpg"},
{id:7, nombre: "Los Simpsons",       genero: "Comedia, Familiar",        temporadas: "38 temporadas",img: "./img/simpsons.jpg"},
{id:8, nombre: "Los Soprano",        genero: "Drama, Thriller",          temporadas: "6 temporadas", img: "./img/sopranos.jpg"},
{id:9, nombre: "Succession",         genero: "Drama, Comedia Negra",     temporadas: "3 temporadas", img: "./img/succession.jpg"},
{id:10, nombre: "Kimetsu No Yaiba",  genero: "Acción, Aventura, Shonen", temporadas: "2 temporadas", img: "./img/kimetsu.jpg"},
{id:11, nombre: "Death Note",        genero: "Drama, Policial, Seinen",  temporadas: "2 temporadas", img: "./img/deathnote.jpg"},
]; 

let tuListaDeSeries = [];

const contenedor = document.getElementById("contenedor"); // Div contenedor general

const seriesCartelera = document.getElementById("cartelera"); // Div contenedor de las series disponibles

const tuLista = document.getElementById("tu-lista"); // Div de las series seleccionadas

const botonSig = document.getElementById("siguiente"); // Boton siguientes series disponibles

const cantidad = document.getElementById("cantidad"); 

function tandaDeSeries(desde, hasta){ // Mostrar una tanda de series de la listaDeSeries

    for(let i = desde; i < hasta; i++) {
        
        serie = listaDeSeries[i]
        indice = i
        let seriesEnLista = document.createElement("div")
        seriesEnLista.className = "disponibles"
        seriesEnLista.innerHTML = `<img src="${serie.img}" class="portada" onclick="agregarATuLista(${indice})">
        <h4>${serie.nombre}</h4>
        `

        seriesCartelera.appendChild(seriesEnLista)

    };

}

function seriesVisibles() {  //El evento click para los botones que cambian las imagenes de series
    
    let inicio = 0 // Primeras series que se muestran
    let final = 6
    let contador = 1

    cantidad.innerHTML = `${contador} / ${listaDeSeries.length / 6}`

    tandaDeSeries(inicio, final);

        contenedor.addEventListener("click", (e)=>{

        if(e.target == botonSig && (final != 12)){ // Muestra mas series, hasta las que hay disponibes, es decir 10(el final)
            
            contador++
            seriesCartelera.innerHTML = null
            inicio += 6
            final  += 6
            tandaDeSeries(inicio,  final)
            cantidad.innerHTML = `${contador} / ${listaDeSeries.length / 6}`

        } else if(e.target == botonSig && (final == 12)){

            seriesCartelera.innerHTML = null
            contador = 1
            inicio = 0
            final  = 6
            tandaDeSeries(inicio, final);
            cantidad.innerHTML = `${contador} / ${listaDeSeries.length / 6}`

        }

    })

}

function verificarSeries(){

    if (localStorage.getItem("series")) {
        
        tuListaDeSeries = JSON.parse(localStorage.getItem("series"));

        tuListaDeSeries.forEach(serie => {
            
            serie.calificacion == null ? mostrarTuLista(serie) : mostrarTuListaActualizada(serie)

        });
    }

}

function noEsRepetida(serieAgregar){ // Verifica tuLista para ver que no haya repetidas, a partir del id de la serie

    indiceEncontrado = tuListaDeSeries.findIndex(serie => serie.id === serieAgregar.id)
    return indiceEncontrado === -1

}


function agregarATuLista(indice){ // Esto suma la serie seleccionada a tu lista

    serieAgregar = listaDeSeries[indice];

    if(noEsRepetida(serieAgregar)){

        tuListaDeSeries.push(serieAgregar);
        mostrarTuLista(serieAgregar);
        actualizarStorage(tuListaDeSeries);
        Toastify({
            text:`${serieAgregar.nombre} fue agregada a tu lista` ,
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


function borrarSerie(idCarta, serieId){ // Función que en base al id de la carta la borra, y borra la misma serie de la lista

    cartaBorrar = document.getElementById(idCarta)
    tuLista.removeChild(cartaBorrar)
    indiceEncontrado = tuListaDeSeries.findIndex(serie => serie.id === serieId)
    tuListaDeSeries.splice(indiceEncontrado, 1)
    actualizarStorage(tuListaDeSeries)

}

function calificar(cartaId){

    let cartaActual = document.getElementById(cartaId)
    idCalificacion = `calificacion ${cartaId}`
    let calificacion = document.getElementById(idCalificacion)
    let calificacionElegida = parseInt(calificacion.options[calificacion.selectedIndex].value);
    let textoCalificacion = document.createElement("p");
    textoCalificacion.className = "textoCalificacion"
    textoCalificacion.innerHTML = `${calificacionElegida}☆`
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

function guardarCalificacion(calificacion, id){

    indiceEncontrado = tuListaDeSeries.findIndex(serie => serie.id === id)
    calificacionActual = `${calificacion}☆`
    tuListaDeSeries[indiceEncontrado].calificacion = calificacionActual
 

}

function mostrarTuListaActualizada(serie){  // Esto crea tu lista para que se vea en html
        
    let carta = document.createElement("div");
    carta.className = "carta"
    carta.id = serie.id
    carta.innerHTML = `<button class="boton" onclick="borrarSerie(${carta.id}, ${serie.id})">Eliminar</button>
    <div><img class="portada-carta" src="${serie.img}"></div>
    <h3>${serie.nombre}</h3>
    <li>Genero: ${serie.genero}</li>
    <li>Duración: ${serie.temporadas}</li>
    <p class="textoCalificacion">${serie.calificacion}</p>`
          
    tuLista.appendChild(carta)

} 


function mostrarTuLista(serie){  // Esto crea tu lista para que se vea en html
        
    let carta = document.createElement("div");
    carta.className = "carta"
    carta.id = serie.id
    carta.innerHTML = `<button class="boton" onclick="borrarSerie(${carta.id}, ${serie.id})">Eliminar</button>
    <div><img class="portada-carta" src="${serie.img}"></div>
    <h3>${serie.nombre}</h3>
    <li>Genero: ${serie.genero}</li>
    <li>Duración: ${serie.temporadas}</li>
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

function actualizarStorage(series){ // Actualiza el storage con las series de tuLista

    localStorage.setItem("series", JSON.stringify(series));
        
};  


verificarSeries();

seriesVisibles();






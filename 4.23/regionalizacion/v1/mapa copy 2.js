var vector = [
   "streets-navigation-vector",
   "streets",
   "topo-vector",
   "satellite",
   "hybrid",
   "dark-gray-vector",
   "oceans",
   "national-geographic",
   "terrain",
   "satellite"
]
var view = undefined;
var map = undefined;
var Layer = undefined;
var loadedMunicipalities = [];  

function LoadMap() {
   require([
       "esri/Map",
       "esri/views/MapView",
      //  "esri/Graphic",
       "esri/layers/GraphicsLayer"
   ], (Map, MapView, /*Graphic,*/ GraphicsLayer) => {
       map = new Map({
           basemap: vector[0]
       });

       view = new MapView({
           container: "viewDiv",
           map: map,
           center: [-97.744778, 19.309404], // longitude, latitude 
           zoom: 8
       });

       const graphicsLayer = new GraphicsLayer();
       map.add(graphicsLayer);

       // Cargar los archivos cuando la vista esté lista
       view.when(() => {
          loadFiles(); // Cargar los archivos al principio
         // console.log('view.when');
       });

       // Observador para carga diferida basada en la extensión del mapa
      //  view.watch("extent", (newExtent) => {
      //     // loadFilesForExtent(newExtent);
      //     console.log('view.watch');
      //  });
   });
}

// Cargar datos desde un archivo JSON
async function loadData(url) {
   let result = [];
   await fetch(url)
       .then(response => {
           if (!response.ok) {
               throw new Error('Network response was not ok');
           }
           return response.json();
       })
       .then(data => {
           result = data;
       })
       .catch(error => {
           console.error('There has been a problem with your fetch operation:', error);
       });

   return result;
}

// Cargar los archivos de geocercas según la extensión visible del mapa
async function loadFiles() {
   const items = await loadData('./files.json');

   let template = {
      type: "FeatureCollection",
      name: "Feature...",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      features:[]
   }

   const angelopolis = await items.filter((e) => e.region == 'ANGELOPOLIS');

   let dataAngelopolis = template;
   for(const item of angelopolis){
      // console.log(item);
      await loadData(item.url).then(element => {
         dataAngelopolis.features.push(element.features[0]);
      });
      dataAngelopolis.name = "FeatureAngelopolis"
    }

   console.log(dataAngelopolis);
   AddGeoJSONLayer({data:dataAngelopolis, color:[[14, 139, 173, 0.5]]});

}


// async function loadFiles() {
//    console.log('loadFiles()');
//    const items = await loadData('./files.json');

//    // Filtrar los municipios que ya han sido cargados (para evitar duplicados)
//    items.forEach(item => {
//        if (!loadedMunicipalities.includes(item.number)) {
//             console.log(item);
//             // AddGeoJSONLayer(item);
//            loadedMunicipalities.push(item.number); // Marcar el municipio como cargado
//        }
//    });
// }

// Cargar los archivos de geocercas según la extensión visible del mapa
function loadFilesForExtent(extent) {
   console.log("loadFilesForExtent()");

   loadData('./files.json').then(items => {
      console.log(items);

       items.forEach(item => {
           // Verificar si el municipio está dentro del área visible y aún no ha sido cargado
           if (!loadedMunicipalities.includes(item.number) && isWithinExtent(item, extent)) {
               AddGeoJSONLayer(item);
               console.log(item);

               loadedMunicipalities.push(item.number); // Marcar como cargado
           }
       });
   });
}

// Función para determinar si el municipio está dentro de la extensión visible
function isWithinExtent(item, extent) {
   // Aquí puedes implementar una lógica para verificar si el área del municipio
   // está dentro de la extensión visible del mapa. 
   // Esto puede depender de las coordenadas del municipio y la extensión del mapa.
   return true; // Se puede modificar con una lógica específica
}

// Función para agregar las capas de GeoJSON al mapa
// function AddGeoJSONLayer(item) {
//    require([
//        "esri/layers/GeoJSONLayer",
//       //  "esri/layers/FeatureLayer",
//        "esri/renderers/SimpleRenderer",
//        "esri/symbols/SimpleFillSymbol"
//    ], function (GeoJSONLayer, /*FeatureLayer,*/ SimpleRenderer, SimpleFillSymbol) {
       
//        // Crear el símbolo simple para los polígonos
//        const simpleFillSymbol = new SimpleFillSymbol({
//            color: item.color,
//            outline: {
//                width: 1,
//                color: "gray"
//            }
//        });

//        // Crear el renderizador simple para la capa
//        const renderer = new SimpleRenderer({
//            symbol: simpleFillSymbol
//        });

//        // Usar un FeatureLayer si se tiene una URL de servicio o GeoJSONLayer si es local
//        Layer = new GeoJSONLayer({
//            url: item.url,
//            renderer: renderer
//        });

//        map.add(Layer); // Agregar la capa al mapa
//    });
// }

// Iniciar el mapa
// LoadMap();

function AddGeoJSONLayer(item){
   require([
      "esri/layers/GeoJSONLayer",
      "esri/layers/FeatureLayer"
   ],function(GeoJSONLayer, FeatureLayer){
      console.log(item.data);
      Layer = new GeoJSONLayer({
         source: item.data,
         renderer: {
            type: "simple", // Tipo de renderer
            symbol: {
                type: "simple-fill",
                color: [14, 139, 173, 0.5], // Color para la geocerca
                outline: {
                    width: 1,
                    color: "gray"
                }
            }
        }
         // url:item.url,
         // renderer: {
         //    type: "simple",
         //    field: "mag",
         //    symbol: {
         //       type: "simple-fill",
         //       color: item.color,
         //       outline: {
         //          width: 1,
         //          color: "gray"
         //       }
         //    }
         // },
      });
      map.add(Layer);
   });
}
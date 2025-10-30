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
           zoom: 7
       });

       const graphicsLayer = new GraphicsLayer();
       map.add(graphicsLayer);

       view.when(() => {
            loadLayers(); 
            // loadMunicipios();
       });
   });
}

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

async function renderJson(items) {
   let result = {
      type: "FeatureCollection",
      name: "",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      features:[]
   }

   for(const item of items){
      await loadData(item.url).then(element => {
         result.features.push(...element.features);
      });
      // result.name = "FeatureAngelopolis"
      result.name = "Feature"
    }

   return result;
}

async function loadLayers() {
   await AddGeoJSONLayer({ url: './map_layers/puebla.geojson', color: [130, 130, 130, 0.1], type: 'files' });
   await loadMunicipios();
   
   const items = await loadData('./files/layers.json');
   const regions = [
      { region: 'S. NORTE - XICOTEPEC', color: [27, 94, 32, 0.5] },
      { region: 'S. NORTE - ZACATLÁN', color: [118, 173, 14, 0.5] },
      { region: 'S. NORORIENTAL', color: [222, 125, 55, 0.5] },
      { region: 'V. SERDÁN', color: [12, 145, 56, 0.5] },
      { region: 'ANGELOPOLIS', color: [14, 139, 173, 0.5] },
      { region: 'V. ATLIXCO Y MATAMOROS', color: [14, 139, 173, 0.5] },
      { region: 'MIXTECA', color: [239, 83, 80, 0.5] },
      { region: 'TEHUACAN', color: [173, 43, 14, 0.5] },
      { region: 'S. NEGRA', color: [173, 14, 93, 0.5] }
   ];

   for (const region of regions) {
      const regionItems = items.filter(e => e.region === region.region);
      const jsonRegion = await renderJson(regionItems);
      await AddGeoJSONLayer({ data: jsonRegion, color: region.color, type: 'rendered' });
   }
}

async function loadMunicipios() {
   const items_1 = await loadData('./files/municipios_1.json');
   await DrawGraphic(items_1, [16, 188, 97], 1);

   const items_2 = await loadData('./files/municipios_2.json');
   await DrawGraphic(items_2, [9, 72, 109], 1);

   const items_3 = await loadData('./files/cedes.json');
   await DrawGraphic(items_3, [], 2);
}

function AddGeoJSONLayer(item){
   require([
      "esri/layers/GeoJSONLayer",
      // "esri/layers/FeatureLayer"
   ], function(GeoJSONLayer/*, FeatureLayer*/){

      if(item.type == 'rendered'){
         Layer = new GeoJSONLayer({
            url: URL.createObjectURL(new Blob([JSON.stringify(item.data)], { type: "application/json" })),
            renderer: {
               type: "simple", 
               symbol: {
                   type: "simple-fill",
                   color: item.color,
                   outline: {
                       width: 1.2,
                       color: "gray" // black
                   }
               }
            }
         });
      }else if(item.type == 'files'){
         Layer = new GeoJSONLayer({
            url:item.url,
            renderer: {
               type: "simple",
               field: "mag",
               symbol: {
                  type: "simple-fill",
                  color: item.color,
                  outline: {
                     width: 1,
                     color: "black" // gray
                  }
               }
            },
         });
      }


      map.add(Layer);
   });
}

function DrawGraphic(items, color, type){
   require([
     "esri/Graphic",
   ],function(Graphic){ 
      // view.graphics.removeAll();
      setTimeout(() => { 
         items.forEach(element =>{

            const Point = {
               type: "point",
               latitude:element.lat,
               longitude:element.long
            };

            let MarkerSymbol = {};
   
            if(type == 1){
               MarkerSymbol = {
                  type: "simple-marker",
                  color: color,
               };
            }else if(type == 2){
               MarkerSymbol = {
                  type: "picture-marker",
                  url: element.icon,
                  width: "10px",
                  height: "10px",
               };
            }

            const pointGraphic = new Graphic({
               geometry: Point,
               symbol: MarkerSymbol,
               attributes: element
            });
            view.graphics.add(pointGraphic);
         });
       }, "500");

   });
}
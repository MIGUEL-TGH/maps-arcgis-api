var vector='streets-navigation-vector';
var view =undefined;
var map = undefined;
var Layer = undefined;

function LoadMap(){
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",

        "esri/layers/GraphicsLayer"
    ],
    (Map, MapView, Graphic, GraphicsLayer) => {
        map = new Map({
        basemap: vector
        });

        view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-97.744778, 19.309404], // longitude, latitude 
            zoom: 7
        });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);
     
      loadFiles();
    });
}

async function loadData(url){
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


async function loadFiles(){
   const items = await this.loadData( './files.json');
   for (const item of items){
      console.log(item);
      await AddGeoJSONLayer({url:item.url, color:item.color});
   }
}

function AddGeoJSONLayer(item){
   require([
      "esri/layers/GeoJSONLayer",
      "esri/layers/FeatureLayer"
   ],function(GeoJSONLayer, FeatureLayer){

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
                  color: "gray"
               }
            }
         },
      });
      map.add(Layer);
   });
}

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
          loadFiles(); 
         
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
      result.name = "FeatureAngelopolis"
    }

   return result;
}

// async function loadFiles() {
//    const items = await loadData('./files.json');

//    const s_norte_1 = await items.filter((e) => e.region == 'S. NORTE - XICOTEPEC');
//    const json_norte_1 = await renderJson(s_norte_1);
//    await AddGeoJSONLayer({data:json_norte_1, color:[89, 143, 67, 0.5]});

//    const s_norte_2 = await items.filter((e) => e.region == 'S. NORTE - AHUACATLÁN');
//    const json_norte_2 = await renderJson(s_norte_2);
//    await AddGeoJSONLayer({data:json_norte_2, color:[118, 173, 14, 0.5]});

//    const s_nororiental = await items.filter((e) => e.region == 'S. NORORIENTAL');
//    const json_nororiental = await renderJson(s_nororiental);
//    await AddGeoJSONLayer({data:json_nororiental, color:[222, 125, 55, 0.5]});

//    const s_serdan = await items.filter((e) => e.region == 'V. SERDÁN');
//    const json_serdan = await renderJson(s_serdan);
//    await AddGeoJSONLayer({data:json_serdan, color:[12, 145, 56, 0.5]});

//    const angelopolis = await items.filter((e) => e.region == 'ANGELOPOLIS' || e.region == 'V. ATLIXCO Y MATAMOROS');
//    const jsonRegion_1 = await renderJson(angelopolis);
//    await AddGeoJSONLayer({data:jsonRegion_1, color:[14, 139, 173, 0.5]});

//    const s_mixteca = await items.filter((e) => e.region == 'MIXTECA');
//    const json_mixteca = await renderJson(s_mixteca);
//    await AddGeoJSONLayer({data:json_mixteca, color:[173, 14, 168, 0.5]});

//    const s_tehuacan = await items.filter((e) => e.region == 'TEHUACAN');
//    const json_tehuacan = await renderJson(s_tehuacan);
//    await AddGeoJSONLayer({data:json_tehuacan, color:[173, 43, 14, 0.5]});

//    const s_negra = await items.filter((e) => e.region == 'S. NEGRA');
//    const json_negra = await renderJson(s_negra);
//    await AddGeoJSONLayer({data:json_negra, color:[173, 14, 93, 0.5]});
// }

async function loadFiles() {
   const items = await loadData('./files.json');

   // const regions = [
   //    { region: 'S. NORTE - XICOTEPEC', color: [89, 143, 67, 0.5] },
   //    { region: 'S. NORTE - AHUACATLÁN', color: [118, 173, 14, 0.5] },
   //    { region: 'S. NORORIENTAL', color: [222, 125, 55, 0.5] },
   //    { region: 'V. SERDÁN', color: [12, 145, 56, 0.5] },
   //    { region: 'ANGELOPOLIS', color: [14, 139, 173, 0.5] },
   //    { region: 'V. ATLIXCO Y MATAMOROS', color: [14, 139, 173, 0.5] },
   //    // { region: 'MIXTECA', color: [173, 14, 168, 0.5] },
   //    { region: 'TEHUACAN', color: [173, 43, 14, 0.5] },
   //    { region: 'S. NEGRA', color: [173, 14, 93, 0.5] }
   // ];


   const regions = [
      { region: 'S. NORTE - XICOTEPEC', color: [27, 94, 32, 0.5] },
      { region: 'S. NORTE - AHUACATLÁN', color: [118, 173, 14, 0.5] },
      { region: 'S. NORORIENTAL', color: [222, 125, 55, 0.5] },
      { region: 'V. SERDÁN', color: [12, 145, 56, 0.5] },
      { region: 'ANGELOPOLIS', color: [14, 139, 173, 0.5] },
      { region: 'V. ATLIXCO Y MATAMOROS', color: [14, 139, 173, 0.5] },
      { region: 'MIXTECA', color: [239, 83, 80, 0.5] },
      { region: 'TEHUACAN', color: [173, 43, 14, 0.5] },
      { region: 'S. NEGRA', color: [173, 14, 93, 0.5] }
   //    { region: 'S. NORTE - XICOTEPEC', color: [85, 107, 47, 0.5] },   // Olive Drab
   // { region: 'S. NORTE - AHUACATLÁN', color: [32, 178, 170, 0.5] },   // Light Sea Green
   // { region: 'S. NORORIENTAL', color: [240, 128, 128, 0.5] },         // Light Coral
   // { region: 'V. SERDÁN', color: [102, 205, 170, 0.5] },              // Medium Aquamarine
   // { region: 'ANGELOPOLIS', color: [70, 130, 180, 0.5] },             // Steel Blue
   // { region: 'V. ATLIXCO Y MATAMOROS', color: [255, 99, 71, 0.5] },   // Tomato
   // { region: 'MIXTECA', color: [186, 85, 211, 0.5] },                 // Medium Orchid
   // { region: 'TEHUACAN', color: [255, 215, 0, 0.5] },                 // Gold
   // { region: 'S. NEGRA', color: [255, 69, 0, 0.5] } 
   ];




   for (const region of regions) {
      const regionItems = items.filter(e => e.region === region.region);
      const jsonRegion = await renderJson(regionItems);
      await AddGeoJSONLayer({ data: jsonRegion, color: region.color });
   }
}

function AddGeoJSONLayer(item){
   require([
      "esri/layers/GeoJSONLayer",
      // "esri/layers/FeatureLayer"
   ], function(GeoJSONLayer/*, FeatureLayer*/){
      Layer = new GeoJSONLayer({
         // url: './map_layers/angelopolis.json',
         url: URL.createObjectURL(new Blob([JSON.stringify(item.data)], { type: "application/json" })),
         renderer: {
            type: "simple", 
            symbol: {
                type: "simple-fill",
                color: item.color,
                outline: {
                    width: 1.2,
                    color: "gray"
                  //   color: "black"
                }
            }
         }
      });
      map.add(Layer);
   });
}
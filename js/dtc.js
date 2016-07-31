var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	stamenUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
	attrib = '&copy; Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> | <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	main = L.tileLayer(stamenUrl, {maxZoom: 18, attribution: attrib}),
	map = new L.Map('map', {
		layers: [main],
		center: [55.7501, 37.6687],
		zoom: 11 
	}),
	overlay = L.tileLayer(osmUrl).addTo(map);
	overlay.getContainer().style.display = "none";
	main.getContainer().style.filter = "url(#sepia)";
	main.getContainer().style.WebkitFilter = "url(#sepia)";

	var marker = L.marker([55.7501, 37.6687]).addTo(map);
	var marker = L.marker([55.7601, 37.6387]).addTo(map);
	var marker = L.marker([55.7401, 37.6887]).addTo(map);
	var marker = L.marker([55.7801, 37.6587]).addTo(map);
	
//Convert Leaflet geometries to D3 geometries
function projectPoint(x, y) {
	var point = map.latLngToLayerPoint(new L.LatLng(y, x));
	this.stream.point(point.x, point.y);
};

//Initialize SVG layer in Leaflet (works for leaflet-0.7.3)
map._initPathRoot()

var transform = d3.geo.transform({point: projectPoint}),
	path = d3.geo.path().projection(transform);

var svg = d3.select(".leaflet-overlay-pane").select("svg"),
	defs = svg.append("defs"),
	clipPath = defs.append("clipPath").attr("id", "clipPath");

//Leaflet.draw stuff
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
	draw: {
		position: 'topleft',
		polygon: {
			title: 'Draw a polygon!',
			allowIntersection: false,
			drawError: {
				color: '#b00b00',
				timeout: 1000
			},
			shapeOptions: {
				color: '#fff',
				weight: 10,
				opacity: 0.8,
				fill: false
			},
			showArea: true
		},
		rectangle: {
			shapeOptions: {
				color: '#fff',
				weight: 10,
				opacity: 0.8,
				fill: false
			}
		},
		polyline: false,
		marker: false,
		circle: {
			shapeOptions: {
				color: '#fff',
				weight: 10,
				opacity: 0.8,
				fill: false
			}
		}
	},
	edit: {
		featureGroup: drawnItems
	}
});

map.addControl(drawControl);

map.on('draw:created', function (e) {
	var type = e.layerType,
	layer = e.layer;

	drawnItems.addLayer(layer);

	var geoJSONlayer = layer.toGeoJSON();
	geoJSONlayer.properties.id = 'l' + layer._leaflet_id;

	clipPath.append("path")
	  .attr("id", 'l' + layer._leaflet_id)
	  .datum(geoJSONlayer)
	  .attr("d", path)
	  .attr("fill", "white")
	  .attr("opacity", 0.95); //change opacity to control masking

	clip();
});

map.on('draw:deleted', function (e) {
	var layers = e.layers;
	layers.eachLayer(function (layer) {
		clipPath.select("#l" + layer._leaflet_id).remove();
	});
	clip();
});

map.on('draw:edited', function (e) {
	var layers = e.layers;
	layers.eachLayer(function (layer) {
		var geoJSONlayer = layer.toGeoJSON();

		clipPath.select("#l" + layer._leaflet_id)
		  .datum(geoJSONlayer)
		  .attr("d", path);
	});
	clip();
});

//Clipping or masking change code accordingly
function clip() {
	var clippingPaths =  clipPath.selectAll("path");
	clippingPaths.attr("d", path);
	
	if (clippingPaths.size() > 0) {
		overlay.getContainer().style.display = "inline";
		overlay.getContainer().style.clipPath = 'url(#clipPath)';
		overlay.getContainer().style.WebkitClipPath = 'url(#clipPath)';
	} else {
		overlay.getContainer().style.display = "none";
		overlay.getContainer().style.clipPath = 'none';
		overlay.getContainer().style.WebkitClipPath = 'none';
	};
};

//Update on move and viewreset
map.on('move', clip);
map.on('viewreset', clip);
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
	var changeOpacity = false;

//Convert Leaflet geometries to D3 geometries
function projectPoint(x, y) {
	var point = map.latLngToLayerPoint(new L.LatLng(y, x));
	this.stream.point(point.x, point.y);
};

function calcLongitudeOffset(radius, latitude) {
	var ltRadius, earthRadius;

	earthRadius = 6378137.0;

	latitudeRadius = 2 * Math.PI * earthRadius * Math.cos(latitude * 0.0175);

	return 360 * radius / latitudeRadius;
}

function calcCircleRadius(circle) {
	var latLng, radius, newLng, centerPoint, edgePoint;

	latLng = circle.getLatLng();
	radius  = circle.getRadius();

	newLng = latLng.lng + calcLongitudeOffset(radius, latLng.lat);
	centerPoint = map.latLngToLayerPoint(latLng);
	edgePoint = map.latLngToLayerPoint(new L.LatLng(latLng.lat, newLng));

	return Math.abs(edgePoint.x - centerPoint.x);

}

function projectCircle(circle)  {
	var center, cx, cy, r;

	center = map.latLngToLayerPoint(circle.getLatLng());
	cx = center.x;
	cy = center.y;
	r = calcCircleRadius(circle);

	return {cx: cx, cy: cy, r: r};
}

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
	var geoJSONlayer, type, layer, circle;

	/* Получаем нашу фигурку с гео-координатами */
	type = e.layerType;
	layer = e.layer;

	/* Добавляем фигурку в список слоёв */
	drawnItems.addLayer(layer);

	if (type === 'circle') {
		circle = projectCircle(layer);

		clipPath.append("circle")
		  .attr("id", 'l' + layer._leaflet_id)
		  .attr("cx", circle.cx)
			.attr("cy", circle.cy)
			.attr("r", circle.r)
		  .attr("fill", "white")
		  .attr("opacity", 0.95); //change opacity to control masking
	} else {
		geoJSONlayer = layer.toGeoJSON();
		geoJSONlayer.properties.id = 'l' + layer._leaflet_id;

		clipPath.append("path")
		  .attr("id", 'l' + layer._leaflet_id)
		  .datum(geoJSONlayer)
		  .attr("d", path)
		  .attr("fill", "white")
		  .attr("opacity", 0.95); //change opacity to control masking
	}

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
	var clippingPaths =  clipPath.selectAll("path, circle");
	clippingPaths.attr("d", path);

	if (clippingPaths.size() > 0) {
		overlay.getContainer().style.display = "inline";
		overlay.getContainer().style.clipPath = 'url(#clipPath)';
		overlay.getContainer().style.WebkitClipPath = 'url(#clipPath)';
		if (changeOpacity === false) {
			overlay.getContainer().style.opacity = "1";
			changeOpacity = true;
		} else {
			overlay.getContainer().style.opacity = "0.99";
			changeOpacity = false;
		}
	} else {
		overlay.getContainer().style.display = "none";
		overlay.getContainer().style.clipPath = 'none';
		overlay.getContainer().style.WebkitClipPath = 'none';
	};
};

//Update on move and viewreset
map.on('move', clip);
map.on('viewreset', clip);

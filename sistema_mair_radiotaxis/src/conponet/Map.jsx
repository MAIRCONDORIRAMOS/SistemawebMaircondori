import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css'; // Importa el CSS de Mapbox GL

const Map = () => {
  const [currentAddress, setCurrentAddress] = useState('');
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGFjZWJlZG8iLCJhIjoiY2x2dW4wdzVlMWxsMTJpcDF6YndtMDhlZCJ9.BxuBFfv2NTozCdkl1sqKgw';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40], // [lng, lat]
        zoom: 9
      });
  
      // Add geolocate control to the map
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      });
      map.addControl(geolocateControl);
  
      // Add a marker at the user's location
      const marker = new mapboxgl.Marker();
      map.on('load', () => {
        map.on('geolocate', (event) => {
          const { coords } = event;
          const { longitude, latitude } = coords;
          marker.setLngLat([longitude, latitude]).addTo(map);
  
          // Reverse geocode to get the street address
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
              const address = data.features[0].place_name;
              setCurrentAddress(address); // Establecer la dirección en el estado local
            })
            .catch(error => {
              console.error('Error fetching address:', error);
            });
        });
  
        // Add marker on map click
        map.on('click', (event) => {
          const { lng, lat } = event.lngLat;
          setMarkerCoordinates({ lng, lat });
  
          // Reverse geocode to get the street address
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
              const address = data.features[0].place_name;
            alert('Dirección:', address);
            })
            .catch(error => {
              console.error('Error fetching address:', error);
            });
        });
      });
  
      // Cleanup
      return () => map.remove();
    }, []);
  
    return (
      <div>
        <div id="map" style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
        {markerCoordinates && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: 10, borderRadius: 5 }}>
            <p>Latitud: {markerCoordinates.lat.toFixed(6)}</p>
            <p>Longitud: {markerCoordinates.lng.toFixed(6)}</p>
            <p>Dirección: {currentAddress}</p>
          </div>
        )}
        {currentAddress && (
          <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'white', padding: 10, borderRadius: 5 }}>
            <p>Dirección: {currentAddress}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default Map;
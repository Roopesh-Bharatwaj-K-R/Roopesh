



import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Nexus UCD, Belfield Office Park: OpenStreetMap node 755857209.
const NEXUS = [-6.23422, 53.31255];
export function renderMap(intro) {
  const host = document.createElement('div');
  host.id = 'journey-map';
  host.setAttribute('aria-label', 'Europe to Dublin and Nexus UCD flyover');
  intro.appendChild(host);
  let map, marker, dead = false, frame = 0, resolveReady;
  const ready = new Promise(resolve => { resolveReady = resolve; });
  const timeout = window.setTimeout(() => resolveReady(false), 10000);
  try {
    map = new maplibregl.Map({
      container: host,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [8, 51], zoom: 3.4, pitch: 0, bearing: 0,
      interactive: false, attributionControl: false,
      canvasContextAttributes: { antialias: true }
    });
    map.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-right');
  } catch {
    window.clearTimeout(timeout); resolveReady(false);
    return { ready, show(){}, fly(){}, arrive(){}, destroy(){host.remove();} };
  }
  map.on('load', () => {
    if (dead) return;
    window.clearTimeout(timeout);
    const layers = map.getStyle().layers;
    for (const layer of layers) {
      if (layer.type === 'background') map.setPaintProperty(layer.id, 'background-color', '#142520');
      if (layer.type === 'fill' && /water/.test(layer.id)) map.setPaintProperty(layer.id, 'fill-color', '#102337');
      if (layer.type === 'fill' && /landcover|landuse|park/.test(layer.id)) map.setPaintProperty(layer.id, 'fill-color', '#294537');
      if (layer.type === 'fill-extrusion') map.removeLayer(layer.id);
    }
    const before = layers.find(l => l.type === 'symbol' && l.layout?.['text-field'])?.id;
    map.addLayer({
      id: 'journey-buildings', type: 'fill-extrusion',
      source: 'openmaptiles', 'source-layer': 'building', minzoom: 14,
      filter: ['!=', ['get','hide_3d'], true],
      paint: {
        'fill-extrusion-color': '#bad5c4',
        'fill-extrusion-height': height(0),
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.96,
        'fill-extrusion-height-transition': { duration: 0 }
      }
    }, before);
    map.setLight({ anchor:'viewport', color:'#fff1da', intensity:.5, position:[1.5,210,35] });
    resolveReady(true);
  });
  map.on('error', e => console.warn('Journey map:', e.error?.message || 'Map resource unavailable'));
  function height(progress) {
    return ['interpolate',['linear'],['zoom'],14,0,16,
      ['*',progress,['max',3,['coalesce',['get','render_height'],8]]]];
  }
  function rise(duration = 1800) {
    cancelAnimationFrame(frame);
    const start = performance.now();
    const draw = now => {
      if (dead || !map.getLayer('journey-buildings')) return;
      const p = Math.min((now-start)/duration,1), eased = 1-Math.pow(1-p,3);
      map.setPaintProperty('journey-buildings','fill-extrusion-height',height(eased));
      if (p < 1) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
  }
  return {
    ready,
    show() { if(dead)return;host.classList.add('on');map.resize(); },
    fly(stage) {
      if(dead)return;
      const views = {
        ireland:{center:[-8,53.35],zoom:6.6,pitch:15,bearing:-8,duration:1600},
        dublin:{center:[-6.26,53.345],zoom:15.8,pitch:58,bearing:-20,duration:2200},
        nexus:{center:NEXUS,zoom:17.5,pitch:62,bearing:24,duration:1600}
      };
      map.flyTo({...views[stage],essential:false});
      if(stage==='dublin')rise(2000);
    },
    arrive() {
      if(dead)return;
      const pin = document.createElement('div');pin.className='nexus-pin';
      const dot=document.createElement('span');dot.className='nexus-dot';
      const label=document.createElement('div');label.className='nexus-label';
      const title=document.createElement('strong');title.textContent='Nexus UCD';
      const sub=document.createElement('small');sub.textContent='Belfield Office Park · CeADAR';
      label.append(title,sub);pin.append(dot,label);
      marker=new maplibregl.Marker({element:pin,anchor:'bottom'}).setLngLat(NEXUS).addTo(map);
      map.easeTo({bearing:44,duration:1400});
    },
    destroy() {
      dead=true;resolveReady(false);window.clearTimeout(timeout);
      cancelAnimationFrame(frame);marker?.remove();map.remove();host.remove();
    }
  };
}

import { ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { Table, tableFromIPC } from 'apache-arrow';
import 'maplibre-gl/dist/maplibre-gl.css';
import { readParquet } from 'parquet-wasm';
import { useEffect, useState } from 'react';
import { Map } from 'react-map-gl/maplibre';


export default function App() {

  const [arrowTable, setArrowTable] = useState<Table<any>>();

  useEffect(() => {
    // React advises to declare the async function directly inside useEffect
    async function getArrowTable() {
      const resp = await fetch("https://humusklimanetz-couch.thuenen.de/datasets/Utah.parquet")
      const buffer = await resp.arrayBuffer()
      const parquetUint8Array = new Uint8Array(buffer);
      const arrowWasmTable = readParquet(parquetUint8Array);
      console.log("arrowWasmTable", arrowWasmTable)
      const arrowTable = tableFromIPC(arrowWasmTable.intoIPCStream());
      setArrowTable(arrowTable);
    };
    if (!arrowTable) {
      console.log("toto1")
        getArrowTable();
    }
  }, []);
  
  const layers = [
    new ScatterplotLayer({
      id: 'deckgl-circle',
      data: [
        {position: [0.45, 51.47]}
      ],
      getPosition: d => d.position,
      getFillColor: [255, 0, 0, 100],
      getRadius: 1000,
    })
  ];

  return (
    <DeckGL
      initialViewState={{
        longitude: 0.45,
        latitude: 51.47,
        zoom: 11
      }}
      controller
      layers={layers}
    >
      <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
    </DeckGL>
  );
}

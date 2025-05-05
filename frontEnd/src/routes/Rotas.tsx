import { Route, Routes } from "react-router";
import MapView from '../pages/MapView';
import ChartView from '../pages/ChartView'; 
import Home from '../components/Home';
import Analytics from '../components/Analytics';


export default function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/chart" element={<ChartView />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
} 
import fireHighIconUrl from "../assets/firehigh.png";
import fireMediumIconUrl from "../assets/firemedium.png";
import fireLowIconUrl from "../assets/firelow.png";
import L from "leaflet";


const fireLowIcon = new L.Icon({
  iconUrl: fireLowIconUrl,
  iconSize: [20, 20],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const fireMediumIcon = new L.Icon({
  iconUrl: fireMediumIconUrl,
  iconSize: [20, 20],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const fireHighIcon = new L.Icon({
  iconUrl: fireHighIconUrl,
  iconSize: [20, 20],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export const getFireIcon = (riskValue: number): L.Icon => {
  if (riskValue <= 0.33) {
    return fireLowIcon;
  } else if (riskValue <= 0.66) {
    return fireMediumIcon;
  } else {
    return fireHighIcon;
  }
};

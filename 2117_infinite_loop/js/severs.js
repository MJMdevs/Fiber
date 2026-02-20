const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Example Cape Town fibre zone (circle)
// Later you replace this with REAL polygons
const fibreZone = {
  lat: -33.9249,
  lng: 18.4241,
  radius: 15000 // 15km
};

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a =
    Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

app.get("/check-coverage", (req, res) => {
  const { lat, lng } = req.query;

  const dist = distance(
    lat,
    lng,
    fibreZone.lat,
    fibreZone.lng
  );

  res.json({
    available: dist <= fibreZone.radius
  });
});

app.listen(3000, () => {
  console.log("Fibre API running on http://localhost:3000");
});

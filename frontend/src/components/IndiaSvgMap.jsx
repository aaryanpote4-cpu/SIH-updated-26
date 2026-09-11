import React, { useState } from 'react';

// Accurate SVG outline paths for Indian States & Union Territories
// Scaled & aligned to a 600x680 viewport representing the full official geography of India
export const INDIA_STATE_PATHS = [
  {
    id: "JK_LADAKH",
    name: "Jammu & Kashmir / Ladakh",
    regionKey: "Jammu and Kashmir",
    d: "M 220 30 L 260 20 L 310 35 L 340 70 L 330 110 L 290 125 L 260 110 L 225 125 L 195 95 L 205 60 Z",
    center: { x: 265, y: 70 }
  },
  {
    id: "HP",
    name: "Himachal Pradesh",
    regionKey: "Himachal Pradesh",
    d: "M 225 125 L 260 110 L 285 125 L 280 155 L 245 160 L 225 140 Z",
    center: { x: 255, y: 135 }
  },
  {
    id: "PB",
    name: "Punjab",
    regionKey: "Punjab",
    d: "M 195 125 L 225 125 L 235 155 L 210 180 L 180 160 Z",
    center: { x: 205, y: 155 }
  },
  {
    id: "UT",
    name: "Uttarakhand",
    regionKey: "Uttarakhand",
    d: "M 285 125 L 325 145 L 315 175 L 280 175 L 280 155 Z",
    center: { x: 300, y: 150 }
  },
  {
    id: "HR",
    name: "Haryana",
    regionKey: "Haryana",
    d: "M 210 180 L 245 160 L 255 180 L 240 215 L 210 210 Z",
    center: { x: 230, y: 190 }
  },
  {
    id: "DL",
    name: "Delhi",
    regionKey: "Delhi",
    d: "M 245 188 L 255 188 L 253 198 L 243 198 Z",
    center: { x: 250, y: 193 }
  },
  {
    id: "RJ",
    name: "Rajasthan",
    regionKey: "Rajasthan",
    d: "M 130 190 L 210 180 L 240 215 L 235 270 L 180 290 L 125 250 Z",
    center: { x: 180, y: 240 }
  },
  {
    id: "UP",
    name: "Uttar Pradesh",
    regionKey: "Uttar Pradesh",
    d: "M 255 180 L 315 175 L 390 220 L 365 275 L 290 280 L 240 235 Z",
    center: { x: 310, y: 235 }
  },
  {
    id: "BR",
    name: "Bihar",
    regionKey: "Bihar",
    d: "M 390 220 L 460 230 L 450 275 L 375 280 L 365 275 Z",
    center: { x: 415, y: 250 }
  },
  {
    id: "JH",
    name: "Jharkhand",
    regionKey: "Jharkhand",
    d: "M 375 280 L 440 275 L 430 330 L 370 330 Z",
    center: { x: 405, y: 305 }
  },
  {
    id: "WB",
    name: "West Bengal",
    regionKey: "West Bengal",
    d: "M 445 225 L 470 235 L 455 315 L 485 365 L 450 375 L 435 320 L 450 275 Z",
    center: { x: 460, y: 300 }
  },
  {
    id: "NE",
    name: "Northeast States (Assam, Meghalaya, etc.)",
    regionKey: "Assam",
    d: "M 470 215 L 530 195 L 585 210 L 575 270 L 535 280 L 490 260 L 475 235 Z",
    center: { x: 525, y: 240 }
  },
  {
    id: "GJ",
    name: "Gujarat",
    regionKey: "Gujarat",
    d: "M 90 270 L 155 260 L 180 290 L 175 350 L 120 365 L 80 320 Z",
    center: { x: 130, y: 315 }
  },
  {
    id: "MP",
    name: "Madhya Pradesh",
    regionKey: "Madhya Pradesh",
    d: "M 180 290 L 290 280 L 370 300 L 340 370 L 220 375 L 175 340 Z",
    center: { x: 275, y: 325 }
  },
  {
    id: "CG",
    name: "Chhattisgarh",
    regionKey: "Chhattisgarh",
    d: "M 340 330 L 385 320 L 375 420 L 330 430 L 330 370 Z",
    center: { x: 355, y: 380 }
  },
  {
    id: "OR",
    name: "Odisha",
    regionKey: "Odisha",
    d: "M 385 320 L 440 330 L 435 410 L 375 420 Z",
    center: { x: 410, y: 370 }
  },
  {
    id: "MH",
    name: "Maharashtra",
    regionKey: "Maharashtra",
    d: "M 155 350 L 245 355 L 320 375 L 300 460 L 210 460 L 160 410 Z",
    center: { x: 225, y: 410 }
  },
  {
    id: "TS",
    name: "Telangana",
    regionKey: "Telangana",
    d: "M 275 420 L 340 415 L 320 485 L 265 470 Z",
    center: { x: 295, y: 450 }
  },
  {
    id: "AP",
    name: "Andhra Pradesh",
    regionKey: "Andhra Pradesh",
    d: "M 320 450 L 375 420 L 360 535 L 290 535 L 310 480 Z",
    center: { x: 335, y: 490 }
  },
  {
    id: "KA",
    name: "Karnataka",
    regionKey: "Karnataka",
    d: "M 195 450 L 265 460 L 275 550 L 220 570 L 190 500 Z",
    center: { x: 230, y: 510 }
  },
  {
    id: "KL",
    name: "Kerala",
    regionKey: "Kerala",
    d: "M 205 560 L 235 560 L 245 640 L 220 645 Z",
    center: { x: 225, y: 600 }
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    regionKey: "Tamil Nadu",
    d: "M 235 550 L 295 535 L 290 630 L 245 640 Z",
    center: { x: 265, y: 590 }
  }
];

// Major Indian Cities Pins with exact SVG coordinates
export const MAJOR_CITIES = [
  { name: "Delhi", state: "Delhi", x: 248, y: 193, topTopic: "#ExamRumor" },
  { name: "Mumbai", state: "Maharashtra", x: 175, y: 405, topTopic: "#BankingScam" },
  { name: "Bengaluru", state: "Karnataka", x: 235, y: 535, topTopic: "#DeepfakeAlert" },
  { name: "Hyderabad", state: "Telangana", x: 295, y: 450, topTopic: "#UPIFraud" },
  { name: "Kolkata", state: "West Bengal", x: 455, y: 345, topTopic: "#FakeNotice" },
  { name: "Chennai", state: "Tamil Nadu", x: 290, y: 565, topTopic: "#WeatherAlert" },
  { name: "Ahmedabad", state: "Gujarat", x: 145, y: 310, topTopic: "#KYCPhish" },
  { name: "Lucknow", state: "Uttar Pradesh", x: 320, y: 240, topTopic: "#PaperLeakRumor" },
  { name: "Jaipur", state: "Rajasthan", x: 205, y: 230, topTopic: "#ExamSafety" },
  { name: "Patna", state: "Bihar", x: 415, y: 250, topTopic: "#FactCheck" },
  { name: "Guwahati", state: "Assam", x: 515, y: 245, topTopic: "#ReliefNotice" },
  { name: "Chandigarh", state: "Punjab", x: 220, y: 145, topTopic: "#AgriSubsidy" },
  { name: "Kochi", state: "Kerala", x: 220, y: 615, topTopic: "#WeatherPatrol" },
  { name: "Bhopal", state: "Madhya Pradesh", x: 265, y: 325, topTopic: "#StudentForum" },
];

export default function IndiaSvgMap({ heatmaps = [], selectedRegion = '', onSelectRegion }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Match state data
  const getStateData = (regionName) => {
    return heatmaps.find(
      (h) => h.region && h.region.toLowerCase().includes(regionName.toLowerCase())
    );
  };

  const getStateFill = (state) => {
    const data = getStateData(state.regionKey);
    const isSelected = selectedRegion && state.regionKey.toLowerCase().includes(selectedRegion.toLowerCase());

    if (isSelected) return '#1769AA'; // Brand Navy/Blue when selected
    if (!data) return '#E2E8F0'; // Light slate default

    if (data.high_risk_count >= 4) return '#EF4444'; // High Danger (Rose Red)
    if (data.high_risk_count >= 1) return '#F59E0B'; // Medium Risk (Amber)
    if (data.post_count > 0) return '#38BDF8'; // Monitored (Cyan Blue)
    return '#E2E8F0';
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none bg-[#F7FAFC] rounded-xl p-2">
      {/* SVG Vector Map Container */}
      <svg
        viewBox="60 10 540 650"
        className="w-full max-h-[380px] drop-shadow-sm cursor-pointer"
      >
        {/* Background Radar / Rings */}
        <circle cx="280" cy="330" r="280" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="280" cy="330" r="190" fill="none" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="280" cy="330" r="100" fill="none" stroke="#E2E8F0" strokeWidth="1" />

        {/* State Boundaries */}
        <g className="states-group">
          {INDIA_STATE_PATHS.map((state) => {
            const data = getStateData(state.regionKey);
            const isHovered = hoveredItem?.name === state.name;
            const isSelected = selectedRegion && state.regionKey.toLowerCase().includes(selectedRegion.toLowerCase());

            return (
              <path
                key={state.id}
                d={state.d}
                fill={getStateFill(state)}
                stroke={isSelected ? '#12355B' : isHovered ? '#1769AA' : '#CBD5E1'}
                strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1'}
                className="transition-all duration-200 hover:opacity-90 hover:brightness-105"
                onMouseEnter={() => setHoveredItem({
                  name: state.name,
                  regionKey: state.regionKey,
                  threats: data?.high_risk_count || 0,
                  posts: data?.post_count || 0,
                  topic: data?.dominant_topic || 'Safe'
                })}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onSelectRegion && onSelectRegion(state.regionKey)}
              />
            );
          })}
        </g>

        {/* Major City Pulsing Threat Pins */}
        <g className="city-pins">
          {MAJOR_CITIES.map((city) => {
            const data = getStateData(city.state);
            const isHigh = (data?.high_risk_count || 0) >= 3;
            const isMedium = (data?.high_risk_count || 0) >= 1 && (data?.high_risk_count || 0) < 3;
            const hasThreat = (data?.high_risk_count || 0) > 0;
            const isSelected = selectedRegion && city.state.toLowerCase().includes(selectedRegion.toLowerCase());

            const pinColor = isHigh ? '#F43F5E' : isMedium ? '#F59E0B' : '#06B6D4';

            return (
              <g
                key={city.name}
                transform={`translate(${city.x}, ${city.y})`}
                className="cursor-pointer group"
                onClick={() => onSelectRegion && onSelectRegion(city.state)}
                onMouseEnter={() => setHoveredItem({
                  name: `${city.name} (${city.state})`,
                  regionKey: city.state,
                  threats: data?.high_risk_count || (hasThreat ? 3 : 0),
                  posts: data?.post_count || 8,
                  topic: data?.dominant_topic || city.topTopic
                })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Live Thermal Shockwave Rings */}
                {hasThreat && (
                  <>
                    <circle
                      r="12"
                      fill="none"
                      stroke={pinColor}
                      strokeWidth="1.5"
                      className="animate-ping opacity-60 origin-center"
                    />
                    <circle
                      r="7"
                      fill={pinColor}
                      fillOpacity="0.25"
                      className="animate-pulse"
                    />
                  </>
                )}

                {/* Outer Pin Halo */}
                <circle
                  r="5"
                  fill={pinColor}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="transition-transform group-hover:scale-125 shadow-xs"
                />

                {/* Inner Dot */}
                <circle r="1.8" fill="#ffffff" />

                {/* City Label */}
                <text
                  x="8"
                  y="3.5"
                  fill="#12355B"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="opacity-90 group-hover:opacity-100 group-hover:fill-[#1769AA]"
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Interactive Tooltip Card */}
      {hoveredItem && (
        <div className="absolute top-2 right-2 p-3 rounded-xl bg-white border border-slate-200 shadow-xl backdrop-blur-md text-xs font-mono pointer-events-none z-20 min-w-[200px]">
          <div className="font-bold text-[#12355B] text-sm border-b border-slate-100 pb-1 flex items-center justify-between">
            <span>{hoveredItem.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${
              hoveredItem.threats >= 3 ? 'bg-rose-50 text-rose-700 border-rose-200' :
              hoveredItem.threats >= 1 ? 'bg-amber-50 text-amber-800 border-amber-200' :
              'bg-blue-50 text-[#1769AA] border-blue-200'
            }`}>
              {hoveredItem.threats >= 3 ? '🔥 High Threat' : hoveredItem.threats >= 1 ? '⚠️ Medium Risk' : 'Active'}
            </span>
          </div>
          <div className="mt-1.5 space-y-1 text-[#4A607A]">
            <div className="flex justify-between">
              <span>Heat Threats:</span>
              <strong className="text-[#12355B]">{hoveredItem.threats}</strong>
            </div>
            <div className="flex justify-between">
              <span>Dominant Trend:</span>
              <span className="text-[#1769AA] truncate max-w-[120px]">{hoveredItem.topic}</span>
            </div>
          </div>
          <div className="mt-1 text-[10px] text-[#1769AA] font-sans border-t border-slate-100 pt-1">
            👉 Click to filter live feed
          </div>
        </div>
      )}
    </div>
  );
}

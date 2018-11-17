import React, { useState } from "react"

import { useFetchJsonp } from "./hooks/useFetchJsonp"

type CameraImage = {
  Id: number
  Name: string
  Geometry: {
    WGS84: string
  }
  Bearing: number
  CameraImageUrl: string
}

const transformer = (cameras: CameraImage[]) =>
  cameras.map((camera) => ({ ...camera, CameraImageUrl: camera.CameraImageUrl + "?" + Date.now() }))

const pollingInterval = 30000 // 30 seconds

export default function App() {
  const [loading, cameras] = useFetchJsonp<CameraImage[]>(
    `https://data.goteborg.se/TrafficCamera/v1.0/TrafficCameras/${process.env.REACT_APP_KEY}?format=json`,
    transformer,
    { pollingInterval }
  )

  if (!cameras) {
    return <div>Loading...</div>
  }

  console.log(cameras)

  return (
    <div className="App">
      <div className="timer" style={{ animationDuration: pollingInterval + "ms" }} />
      <div className="grid">
        {cameras.map((camera) => (
          <img key={camera.CameraImageUrl} src={camera.CameraImageUrl} />
        ))}
      </div>
    </div>
  )
}

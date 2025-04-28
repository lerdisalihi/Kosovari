import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapView } from '../views/MapView'
import { MapController } from '../controllers/MapController'
import { useIssueStore } from '../store/issues'

export function Home() {
  const [searchParams] = useSearchParams()
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const controller = new MapController()
  const fetchIssues = useIssueStore(state => state.fetchIssues)

  useEffect(() => {
    fetchIssues()
  }, [fetchIssues])

  useEffect(() => {
    if (lat && lng) {
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lng)
      if (!isNaN(latitude) && !isNaN(longitude)) {
        controller.setCenter([latitude, longitude])
        controller.setZoom(16)
      }
    }
  }, [lat, lng])

  return (
    <div className="h-screen w-full">
      <MapView controller={controller} />
    </div>
  )
} 
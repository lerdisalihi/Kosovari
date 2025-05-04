import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapView } from '../views/MapView'
import { MapController } from '../controllers/MapController'
import { getCurrentLocation, formatCoordinates } from '../lib/services/location'
import { useIssueStore } from '../store/issues'
import { toast } from 'react-hot-toast'

export function Home() {
  const [searchParams] = useSearchParams()
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const [location, setLocation] = useState<GeolocationPosition | null>(null)
  const [loading, setLoading] = useState(false)
  const controller = new MapController()
  const fetchIssues = useIssueStore(state => state.fetchIssues)
  const requestLocation = async () => {
    try {
      setLoading(true)
      const position = await getCurrentLocation()
      setLocation(position)
      controller.setCenter([position.coords.latitude, position.coords.longitude])
      controller.setZoom(16)
    } catch (err: any) {
      console.error('Error getting location:', err)
      toast.error('Please allow location access to see your coordinates')
    } finally {
      setLoading(false)
    }
  }
  //location permission
  useEffect(() => {
    requestLocation()
  }, [])

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
    <div className="h-full w-full relative">
      <MapView controller={controller} />

      <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-90 rounded-lg shadow-md p-3 text-sm">
        {loading ? (
          <span className="text-gray-600">Getting location...</span>
        ) : location ? (
          <div className="flex items-center space-x-2">
            <span className="font-medium">Your location:</span>
            <span>
              {formatCoordinates(
                location.coords.latitude,
                location.coords.longitude
              )}
            </span>
            <button
              onClick={requestLocation}
              className="ml-2 text-blue-500 hover:text-blue-600"
              title="Update location"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={requestLocation}
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Allow location access
          </button>
        )}
      </div>
    </div>
  )
} 
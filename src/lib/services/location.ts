export const getCurrentLocation = (): Promise<GeolocationPosition> => {
    console.log('Requesting location...');
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported');
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
  
      console.log('Geolocation is supported, requesting position...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position);
          resolve(position);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };
  
  export const isGeolocationAvailable = (): boolean => {
    const available = !!navigator.geolocation;
    console.log('Geolocation available:', available);
    return available;
  };
  
  export const formatCoordinates = (latitude: number, longitude: number): string => {
    return `${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°`;
  };
  
  export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  }; 
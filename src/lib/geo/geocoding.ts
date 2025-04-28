export async function getAddressFromCoordinates(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'KosovAR Community Issue Reporter',
        },
      }
    );
    const data = await response.json();
    return {
      street: data.address?.road || data.address?.pedestrian || 'Unknown location',
      neighborhood: data.address?.suburb || data.address?.neighbourhood || data.address?.residential || '',
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    return {
      street: 'Unknown location',
      neighborhood: '',
    };
  }
} 
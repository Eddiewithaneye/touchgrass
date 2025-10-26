export interface ScavengerHunt {
  id: string
  name: string
  description: string
  prompts: string[]
}

export interface LocationData {
  state?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

// US States list for manual selection
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
]

// Default scavenger hunt
export const DEFAULT_HUNT: ScavengerHunt = {
  id: 'default',
  name: 'Nature Explorer Hunt',
  description: 'Discover the natural world around you with these classic challenges',
  prompts: [
    'Find a leaf',
    'Find a tree',
    'Find a flower',
    'Find a rock',
    'Find a bird',
    'Find a spider web',
    'Find moss',
    'Find a stick',
    'Find grass',
    'Find a cloud'
  ]
}

// State-specific scavenger hunts
export const STATE_HUNTS: Record<string, ScavengerHunt> = {
  'Florida': {
    id: 'florida',
    name: 'KnightHacks Scavenger Hunt',
    description: 'Special hunt for the KnightHacks event in Florida',
    prompts: [
      'Find T.K.'
    ]
  }
}

// Location detection functions
export async function detectUserLocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Try to get state from coordinates using reverse geocoding
          const state = await getStateFromCoordinates(latitude, longitude)
          resolve({
            state,
            coordinates: { latitude, longitude }
          })
        } catch (error) {
          console.error('Error getting state from coordinates:', error)
          resolve({
            coordinates: { latitude, longitude }
          })
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        resolve(null)
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    )
  })
}

// Simple reverse geocoding to get state (you might want to use a proper service)
async function getStateFromCoordinates(lat: number, lng: number): Promise<string | undefined> {
  try {
    // Using a free geocoding service (you might want to replace with a more reliable one)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    )
    
    if (response.ok) {
      const data = await response.json()
      return data.principalSubdivision || data.principalSubdivisionCode
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
  }
  
  return undefined
}

// Get scavenger hunt based on location
export function getScavengerHunt(location?: LocationData): ScavengerHunt {
  if (location?.state && STATE_HUNTS[location.state]) {
    return STATE_HUNTS[location.state]
  }
  
  return DEFAULT_HUNT
}

// Check if a state has a custom hunt
export function hasCustomHunt(state: string): boolean {
  return state in STATE_HUNTS
}
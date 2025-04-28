import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function RegisterForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    emri: '',
    email: '',
    password: '',
    roli: 'citizen'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Register form submitted!')
    try {
      const response = await fetch('http://localhost:4000/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emri: formData.emri,
          email: formData.email,
          password_hash: formData.password,
          roli: formData.roli,
          leveli: 0,
          pike_eksperience: 0
        })
      })
      console.log('Fetch sent! Status:', response.status)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Regjistrohu</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="emri" className="block text-sm font-medium text-gray-700">
            Emri
          </label>
          <input
            type="text"
            id="emri"
            value={formData.emri}
            onChange={(e) => setFormData({ ...formData, emri: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Fjalëkalimi
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="roli" className="block text-sm font-medium text-gray-700">
            Roli
          </label>
          <select
            id="roli"
            value={formData.roli}
            onChange={(e) => setFormData({ ...formData, roli: e.target.value as 'citizen' | 'institution' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="citizen">Qytetar</option>
            <option value="institution">Institucion</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Duke u regjistruar...' : 'Regjistrohu'}
        </button>
      </form>
    </div>
  )
} 
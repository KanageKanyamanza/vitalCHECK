import React from 'react'
import { UBBLogo } from '../ui'

const LogoTest = () => {
  const logoTypes = [
    { type: 'ms-icon', name: 'MS Icon (310x310)', description: 'Logo principal haute résolution' },
    { type: 'favicon', name: 'Favicon (96x96)', description: 'Logo compact pour navigateur' },
    { type: 'apple-icon', name: 'Apple Icon (180x180)', description: 'Logo pour appareils Apple' }
  ]

  const sizes = ['small', 'medium', 'large', 'xlarge']

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        🎨 Test des Logos UBB
      </h1>

      {/* Test des différents types de logos */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Types de Logos Disponibles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {logoTypes.map((logo) => (
            <div key={logo.type} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {logo.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {logo.description}
              </p>
              
              <div className="flex justify-center">
                <UBBLogo 
                  size="medium" 
                  showText={false} 
                  animated={false}
                  logoType={logo.type}
                />
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                Type: {logo.type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test des différentes tailles */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Tailles Disponibles
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sizes.map((size) => (
            <div key={size} className="bg-white rounded-lg shadow-lg p-4 text-center">
              <h3 className="text-sm font-semibold mb-2 text-gray-800 capitalize">
                {size}
              </h3>
              
              <div className="flex justify-center mb-2">
                <UBBLogo 
                  size={size} 
                  showText={false} 
                  animated={false}
                  logoType="ms-icon"
                />
              </div>
              
              <div className="text-xs text-gray-500">
                {size === 'small' && '12x12 (48px)'}
                {size === 'medium' && '16x16 (64px)'}
                {size === 'large' && '24x24-32x32 (96-128px)'}
                {size === 'xlarge' && '40x40-48x48 (160-192px)'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test avec texte */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Logos avec Texte
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Logo Principal (MS Icon)
            </h3>
            <UBBLogo 
              size="large" 
              showText={true} 
              animated={false}
              logoType="ms-icon"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Logo Compact (Favicon)
            </h3>
            <UBBLogo 
              size="medium" 
              showText={true} 
              animated={false}
              logoType="favicon"
            />
          </div>
        </div>
      </div>

      {/* Test d'animation */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Test d'Animation
        </h2>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">
            Cliquez pour voir l'animation
          </h3>
          
          <div className="flex justify-center">
            <UBBLogo 
              size="large" 
              showText={true} 
              animated={true}
              logoType="ms-icon"
            />
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            Animation: Rotation + Scale + Fade In
          </p>
        </div>
      </div>

      {/* Instructions d'utilisation */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">
          💡 Comment Utiliser
        </h3>
        
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Props disponibles :</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code>size</code>: 'small', 'medium', 'large', 'xlarge'</li>
            <li><code>showText</code>: true/false (afficher le texte UBB)</li>
            <li><code>animated</code>: true/false (animations d'entrée)</li>
            <li><code>logoType</code>: 'ms-icon', 'favicon', 'apple-icon'</li>
            <li><code>className</code>: classes CSS personnalisées</li>
          </ul>
          
          <p className="mt-4"><strong>Exemple d'utilisation :</strong></p>
          <pre className="bg-blue-100 p-2 rounded text-xs overflow-x-auto">
{`<UBBLogo 
  size="large" 
  showText={true} 
  animated={true}
  logoType="ms-icon"
/>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default LogoTest

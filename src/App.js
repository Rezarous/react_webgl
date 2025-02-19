import React, { useEffect, useState } from 'react'

function App() {
  const [unityInstance, setUnityInstance] = useState(null)

  useEffect(() => {
    // Load Unity WebGL only once when component mounts
    const loadUnity = async () => {
      const buildUrl = '/WebGLBuild/Build'
      const loaderUrl = buildUrl + '/WebGLBuild.loader.js'

      const config = {
        dataUrl: buildUrl + '/WebGLBuild.data',
        frameworkUrl: buildUrl + '/WebGLBuild.framework.js',
        codeUrl: buildUrl + '/WebGLBuild.wasm',
        streamingAssetsUrl: '/WebGLBuild/StreamingAssets',
        companyName: 'DefaultCompany',
        productName: 'WebGL_Test',
        productVersion: '0.1',
      }

      // Inject Unity Loader script dynamically
      const script = document.createElement('script')
      script.src = loaderUrl
      script.onload = () => {
        window
          .createUnityInstance(document.getElementById('unity-canvas'), config)
          .then((instance) => {
            setUnityInstance(instance)
          })
      }

      document.body.appendChild(script)

      // ✅ MOBILE VIEWPORT FIX
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        const meta = document.createElement('meta')
        meta.name = 'viewport'
        meta.content =
          'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes'
        document.getElementsByTagName('head')[0].appendChild(meta)

        document.getElementById('unity-container').className = 'unity-mobile'
        document.getElementById('unity-canvas').className = 'unity-mobile'
      } else {
        document.getElementById('unity-canvas').style.width = '960px'
        document.getElementById('unity-canvas').style.height = '600px'
      }
    }

    loadUnity()
  }, [])

  // Function to send a message to Unity
  const sendTextToUnity = (text) => {
    if (unityInstance) {
      unityInstance.SendMessage('TextReceiver', 'ReceiveTextFromJS', text)
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      {/* Unity Canvas */}
      <div id='unity-container' className='unity-desktop'>
        <canvas id='unity-canvas' width='960' height='600'></canvas>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => sendTextToUnity('one')}>1</button>
        <button onClick={() => sendTextToUnity('two')}>2</button>
        <button onClick={() => sendTextToUnity('three')}>3</button>
      </div>
    </div>
  )
}

export default App

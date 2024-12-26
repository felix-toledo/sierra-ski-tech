import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [skierType, setSkierType] = useState('');
  const [soleLength, setSoleLength] = useState('');
  const [result, setResult] = useState(null);

  const skiChart = {
    weightRanges: [
      { range: "22-29", skierCode: "A" },
      { range: "30-38", skierCode: "B" },
      { range: "39-47", skierCode: "C" },
      { range: "48-56", skierCode: "D" },
      { range: "57-66", skierCode: "E" },
      { range: "67-78", skierCode: "F" },
      { range: "79-91", skierCode: "G" },
      { range: "92-107", skierCode: "H", height: {from: 0, to: 4.10}},
      { range: "108-125", skierCode: "I", height: {from: 4.11, to: 5.1}},
      { range: "126-147", skierCode: "J", height: {from: 5.2, to: 5.5} },
      { range: "148-174", skierCode: "K", height: {from: 5.6, to: 5.10} },
      { range: "175-209", skierCode: "L", height: {from: 5.11, to: 6.4} },
      { range: "≥210", skierCode: "M", height: {from: 6.5, to: 7.0} },
    ],
    indicatorSettings: {
      soleLength: [{from:0 , to:230}, {from:231 , to:250}, {from:251 , to:270},{from:271 , to:290}, {from:291 , to:310}, {from:311 , to:330}, {from:331 , to:350}, {from:351 , to:1000}],
      skierCodes: {
        A: [0.75, 0.75, 0.75, 'Check table A4', 'Check table A5', 'Check table A6', 'Check table A7', 'Check table A8'],
        B: [1, 0.75, 0.75, 0.75, 'Check table B5', 'Check table B6', 'Check table B7', 'Check table B8'],
        C: [1.5, 1.25, 1.25, 1, 'Check table C5', 'Check table C6', 'Check table C7', 'Check table C8'],
        D: [2, 1.75, 1.5, 1.5, 1.25, 'Check table D6', 'Check table D7', 'Check table D8'],
        E: [2.5, 2.25, 2, 1.75, 1.5, 1.5, 'Check table E7', 'Check table E8'],
        F: [3, 2.75, 2.5, 2.25, 2, 1.75, 1.75, 'Check table F8'],
        G: ['Look table G1', 3.5, 3, 2.75, 2.5, 2.25, 2, 'Check table G8'],
        H: ['Look table H1', 'Look table H2', 3.5, 3, 3, 2.75, 2.5, 'Look table H8'],
        I: ['Check table I1', 'Check table I2', 4.5, 4, 3.5, 3.5, 3, 'Check table I8'],
        J: ['Check table J1', 'Check table J2', 5.5, 5, 4.5, 4, 3.5, 3],
        K: ['Check table K1', 'Check table K2', 6.5, 6, 5.5, 5, 4.5, 4],
        L: ['Check table L1', 'Check table L2', 7.5, 7, 6.5, 6, 5.5, 5],
        M: ['Check table M1', 'Check table M2', 'Check table M3', 8.5, 8, 7, 6.5, 6],
        N: ['Check table N1', 'Check table N2', 'Check table N3', 10, 9.5, 8.5, 8, 7.5],
        O: ['Check table O1', 'Check table O2', 'Check table O3', 11.5, 11, 10, 9.5, 9],
        P: ['Check table P1', 'Check table P2', 'Check table P3', 'Check table P4', 'Check table P5', 12, 11, 10.5],        
      },
    }
  };

  const weightRef = useRef(null);
  const heightRef = useRef(null);
  const skierTypeRef = useRef(null);
  const soleLengthRef = useRef(null);

  const calculateSkierCode = () => {
    let weightRange = skiChart.weightRanges.find(range => {
      const [min, max] = range.range.split('-').map(Number);
      return weight >= min && weight <= max;
    });
  
    if (!weightRange) {
      setResult("Invalid weight range");
      return;
    }
  
    let skierCode = weightRange.skierCode;
    console.log('dps del weight: ', skierCode);
    // Convertir altura ingresada (pies y pulgadas) a pulgadas totales
    const heightInInches = parseFloat(height);
    console.log(heightInInches)
    // Buscar el rango de altura correspondiente
    const heightRange = skiChart.weightRanges.find(range => {
      if (!range.height) return false;
      
      const { from, to } = range.height;
      const minHeight = from; // Convertir pies a pulgadas
      const maxHeight = to; // Convertir pies a pulgadas (si no hay límite superior, usar Infinity)

      return heightInInches >= minHeight && heightInInches <= maxHeight;
    });

    // Verificar si el `skierCode` de la altura es menor
    console.log(heightRange)
    if (heightRange && heightRange.skierCode < skierCode) {
      skierCode = heightRange.skierCode;
      console.log('dps del height: ', skierCode);
    }
  
    // Ajustar skierCode según edad
    if (age <= 9 || age >= 50) {
      skierCode = String.fromCharCode(skierCode.charCodeAt(0) - 1);
      console.log('dps del age: ', skierCode);
    }
  
    // Ajustar skierCode según el tipo de esquiador
    if (skierType === '2') {
      skierCode = String.fromCharCode(skierCode.charCodeAt(0) + 1);
      console.log('dps del 2: ', skierCode);
    } else if (skierType === '3') {
      skierCode = String.fromCharCode(skierCode.charCodeAt(0) + 2);
      console.log('dps del 3: ', skierCode);
    }
  
    // Encontrar configuración del indicador
    // Encontrar el índice correcto del rango de soleLength
    const soleIndex = skiChart.indicatorSettings.soleLength.findIndex(range => {
      return soleLength >= range.from && soleLength <= range.to;
    });

    // Verificar si se encontró un índice válido
    const indicatorSetting = skiChart.indicatorSettings.skierCodes[skierCode]?.[soleIndex] || "Not found";    
  
    setResult({ 
      skierCode, 
      indicatorSetting,
      inputData: { age, weight, height, skierType, soleLength } 
    });
    setAge('');
    setWeight('');
    setHeight('');
    setSkierType('');
    setSoleLength('');
  };
  
    // Controlador para manejar Enter y pasar al siguiente input
    const handleKeyDown = (event, nextRef) => {
      if (event.key === 'Enter' && nextRef) {
        event.preventDefault();
        nextRef.current.focus();
      }
    };

    const handleHeightChange = (e) => {
      let value = e.target.value;
      // Reemplazar coma por punto
      value = value.replace(',', '.');
      setHeight(value);
    };

  return (
<div className="App">
      <header className="header">
        <img src="/sierra.svg" alt="Sierra Ski Tech Logo" className="logo" />
      </header>
      <main className="main">
        <h2>Ski Chart Calculator</h2>
        <form onSubmit={(e) => e.preventDefault()} className="form">
          <div className="input-group">
            <label>Age: </label>
            <input
              type="number"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, weightRef)}
            />
          </div>
          <div className="input-group">
            <label>Weight (lbs): </label>
            <input
              type="number"
              inputMode="numeric"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, heightRef)}
              ref={weightRef}
            />
          </div>
          <div className="input-group">
            <label>Height (inches): </label>
            <input
              type="text"
              inputMode="decimal"
              value={height}
              onChange={handleHeightChange}
              onKeyDown={(e) => handleKeyDown(e, skierTypeRef)}
              ref={heightRef}
              placeholder='E.g.: 5.10 (Important to separate ft and in with a point or a comma)'
            />
          </div>
          <div className="input-group">
            <label>Type of Skier (1, 2, 3): </label>
            <input
              type="text"
              inputMode="numeric"
              value={skierType}
              onChange={(e) => setSkierType(e.target.value.toUpperCase())}
              onKeyDown={(e) => handleKeyDown(e, soleLengthRef)}
              ref={skierTypeRef}
            />
          </div>
          <div className="input-group">
            <label>Sole Length (mm): </label>
            <input
              type="number"
              inputMode="numeric"
              value={soleLength}
              onChange={(e) => setSoleLength(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, null)} // Último input, sin referencia siguiente
              ref={soleLengthRef}
            />
          </div>
          <button className="btn" onClick={calculateSkierCode}>Calculate</button>
        </form> 

        {result && (
          <div className="results">
            <h2>Results</h2>
                    {typeof result === "string" ? (
          <p>{result}</p>
        ) : (
          <div className="result-summary">
            <p><strong>Skier Code:</strong> {result.skierCode}</p>
            <p><strong>Indicator Setting:</strong> {result.indicatorSetting}</p>
            <small>
              <strong>Input Data: </strong> 
              Age: {result.inputData.age}, 
              Weight: {result.inputData.weight} lbs, 
              Height: {result.inputData.height} inches, 
              Type: {result.inputData.skierType}, 
              Sole Length: {result.inputData.soleLength} mm
            </small>
          </div>
        )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

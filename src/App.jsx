import { useState } from 'react';
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
        A: [0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
        B: [1, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
        C: [1.5, 1.25, 1.25, 1, 1, 1, 1, 1],
        D: [2, 1.75, 1.5, 1.5, 1.25, 1.25, 1.25, 1.25],
        E: [2.5, 2.25,2,  1.75, 1.5, 1.5, 1.5, 1.5],
        F: [3, 2.75, 2.5, 2.25, 2, 1.75, 1.75, 1.75],
        G: [3.5, 3.5, 3, 2.75, 2.5, 2.25, 2, 2],
        H: [3.5, 3.5, 3.5, 3, 3, 2.75, 2.5, 2.5],
        I: [4.5, 4.5, 4.5, 4, 3.5, 3.5, 3, 3],
        J: [5.5, 5.5, 5.5, 5, 4.5, 4, 3.5, 3],
        K: [6.5, 6.5, 6.5, 6, 5.5, 5, 4.5, 4],
        L: [7.5, 7.5, 7.5, 7, 6.5, 6, 5.5, 5],
        M: [8.5, 8.5, 8.5, 8.5, 8, 7, 6.5, 6],
        N: [10, 10, 10, 10, 9.5, 8.5, 8, 7.5],
        O: [11.5, 11.5, 11.5, 11.5, 11, 10, 9.5, 9],
        P: [12, 12, 12, 12, 12, 12, 11, 10.5],
      },
    }
  };

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
  
    // Buscar el rango de altura correspondiente
    const heightRange = skiChart.weightRanges.find(range => {
      if (!range.height) return false;

      const { from, to } = range.height;
      const minHeight = from * 12; // Convertir pies a pulgadas
      const maxHeight = to ? to * 12 : Infinity; // Convertir pies a pulgadas (si no hay límite superior, usar Infinity)

      return heightInInches >= minHeight && heightInInches <= maxHeight;
    });

    // Verificar si el `skierCode` de la altura es menor
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
  
    setResult({ skierCode, indicatorSetting });
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
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Weight (lbs): </label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Height (inches): </label>
            <input placeholder='E.g.: 4.11' type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Type of Skier (1, 2, 3): </label>
            <input type="text" value={skierType} onChange={(e) => setSkierType(e.target.value.toUpperCase())} />
          </div>
          <div className="input-group">
            <label>Sole Length (mm): </label>
            <input type="number" value={soleLength} onChange={(e) => setSoleLength(e.target.value)} />
          </div>
          <button className="btn" onClick={calculateSkierCode}>Calculate</button>
        </form>

        {result && (
          <div className="results">
            <h2>Results</h2>
            {typeof result === "string" ? (
              <p>{result}</p>
            ) : (
              <div>
                <p>Skier Code: {result.skierCode}</p>
                <p>Indicator Setting: {result.indicatorSetting}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

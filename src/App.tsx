import { useEffect, useState } from 'react';
import './App.css';
import './components/CarCard/CarCard'; 
import CarCard from './components/CarCard/CarCard';
import Modal from 'react-modal';

const getCars = async () => {
  let res = await fetch(`${process.env.REACT_APP_API_URL}/cars`);
  return  res.json();   
}

interface Car {
  description: string,
  make: string,
  model: string,
  km: number,
  id: number,
  image: string,
  estimatedate: string, 
  inMaintenance?: boolean
}

Modal.setAppElement('#root')

function App() {

  const [cars, setCars] = useState<Array<Car>>([]);
  
  
  useEffect(() => {
    getCars()
      .then(items => {
        setCars(items)
      }).catch(err => console.log(err))
  }, []); 

  return (
    <div className="App">
      <header className="App-header">
        
      </header>

      <div className="container">
        <div className="row">
          <h3>Carros en Mantenimiento</h3>
        </div>
        <div className="row">
          {
            cars.map((car, i) => {
              return <CarCard key={car?.id || i} {...car} />
            })  
          }
        </div>
      </div>
    </div>
  );
}

export default App;

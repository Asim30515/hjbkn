/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import "./App.css"
import { BiArrowToTop, BiArrowFromTop } from "react-icons/bi";

function App() {
  const [kinolar, setKinolar] = useState([]);
  const [secilmisKinolar, setSecilmisKinolar] = useState([])
  const [secilmisJanr, setSecilmisJanr] = useState('all');
  const [janrlar, setJanrlar] = useState([]);
  const [inputDeyeri, setInputDeyeri] = useState('');
  const [reytinqSiralamasi, setReytinqSiralamasi] = useState('all')


  const KinolariGetir = async () => {
    try {
      const sorgu = await fetch('http://localhost:3000/filmler')
      if (sorgu.ok) {
        const cavab = await sorgu.json();
        setKinolar(cavab);
        setSecilmisKinolar(cavab)
      }
    } catch (error) {
      console.error(error);
    }
  }
  const JanrlariGetir = async () => {
    try {
      const sorgu = await fetch('http://localhost:3000/janrlar')
      if (sorgu.ok) {
        const cavab = await sorgu.json();
        setJanrlar(cavab);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const janraEsasenGoster = (janr) => {
    if (janr === 'All') {
      setSecilmisJanr('all')
      setSecilmisKinolar(kinolar)
    } else {
      const filt = kinolar.filter(item => item.janr === janr);
      setSecilmisKinolar(filt)
      setSecilmisJanr(janr)
    }
  }

  const handleInputChange = (text) => {
    setInputDeyeri(text);
    const filtered = kinolar.filter((item) =>
      item.movie.toLowerCase().includes(text.toLowerCase())
    );
    setSecilmisKinolar(filtered);
  }

  const handleSelectChange = text => {
    setReytinqSiralamasi(text);
    if (text === 'all') {
      setSecilmisKinolar(kinolar)
    } else if (text === 'artan') {
      const sorted = [...kinolar].sort((a, b) => a.rating - b.rating);
      setSecilmisKinolar(sorted);
    } else if (text === 'azalan') {
      const sorted = [...kinolar].sort((a, b) => b.rating - a.rating);
      setSecilmisKinolar(sorted);
    }
  }

  useEffect(() => {
    KinolariGetir();
    JanrlariGetir();
  }, [])




  return (
    <>
      <div className="inputs">
        <select value={reytinqSiralamasi} onChange={(e) => handleSelectChange(e.target.value)}>
          <option hidden>Reytinq</option>
          <option defaultValue={"all"} value={'all'}>Normal</option>
          <option value={'artan'}>Artan</option>
          <option value={'azalan'}>Azalan</option>
        </select>
        <input type="text" placeholder="Search" value={inputDeyeri} onChange={(e) => handleInputChange(e.target.value)} />
        <div className="icons">
          <BiArrowToTop className="icon" />
          <BiArrowFromTop className="icon" />
        </div>
      </div>
      {janrlar && janrlar.length > 0 && (
        <div className="buttons">
          <button className={secilmisJanr === 'all' ? 'active' : ''} onClick={() => janraEsasenGoster('All')}>All</button>
          {
            janrlar.map(item => (
              <button className={secilmisJanr === item.ad ? 'active' : ''} key={item.id} onClick={() => janraEsasenGoster(item.ad)}>{item.ad}</button>
            ))
          }
        </div>
      )}
      <div className="umumi">
        {
          secilmisKinolar.length > 0 && secilmisKinolar.map(item => (
            <div className="card" key={item.id}>
              <div>
                <img className="photo" src={item.image} alt="" />
              </div>
              <div className="yazi">
                <span className="ad">{item.movie}</span>
                <span className="xal">{item.rating}</span>
              </div>
              <div>
                <a href={item.imdb_url}>Filme Kecid et</a>
              </div>
            </div>
          ))}
      </div>

    </>
  )
}
export default App

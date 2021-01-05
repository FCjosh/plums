import React, {useState} from 'react';
import './App.css';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [showing, setShowing] = useState('home');
  const [isLoad, setIsLoad] = useState(false);
  const [recipe, setRecipe] = useState({});

  const handleItem = (id) => {
    setShowing('recipe');
    fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=cacaef5c287c4b159cf6aeb1dc609470`)
    .then(res => res.json())
    .then(
      (result) => {
        setRecipe(result);
        console.log(result);
        setIsLoad(true);
      },
      (err) => {
        setIsLoad(true);
        console.log(err);
      }
    );
  }

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowing('search');
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${searchValue}&number=10&apiKey=cacaef5c287c4b159cf6aeb1dc609470`)
    .then(res => res.json())
    .then(
      (result) => {
        setIsLoaded(true);
        const searchList = result.results;
        setItems(searchList);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <label>
            Search recipes
            <input type="text" value={searchValue} onChange={handleChange}></input>
          </label>
          <input type="submit" value="Submit" />
        </form>

        {error ? 
          <div>Error: {error.message}</div>
        : showing === 'home' ?
          <div></div>
        : showing === 'search' ?
          !isLoaded ?
            <div>Loading...</div>
          :
            <div className="grid-wrapper">
                {items.map(item => (
                    <button onClick={() => handleItem(item.id)} className="itemButton" key={item.id}>
                      <div className="itemTitle">
                        {item.title}
                      </div>
                      <img src={item.image} alt={item.title} className="itemImage"></img>
                    </button>
                ))}
            </div>
          : showing === 'recipe' ?
            <div>
              {isLoad ? <div>
              <ul>
              {recipe.extendedIngredients.map((item, index) => (
                <li key={index}>
                    {item.original}
                </li>
              ))}
            </ul>
            <ul>
              {recipe.analyzedInstructions[0].steps.map((item, index) => (
                <li key={index}>
                    {item.step}
                </li>
              ))}
            </ul>
            </div> : <div>Loading...</div>}
            </div>
          :
            <div></div>
        }
      </header>
    </div>
  );
}

export default App;

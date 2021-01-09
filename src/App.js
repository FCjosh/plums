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
  const [sort, setSort] = useState("meta-score");
  const [sortDirection, setSortDirection] = useState('asc');

  const searchAPI = () => {
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${searchValue}&number=10&sort=${sort}&sortDirection=${sortDirection}&apiKey=cacaef5c287c4b159cf6aeb1dc609470`)
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
    searchAPI();
  }
  const handleSort = () => {
    if(showing === "search"){
      searchAPI();
    }
  }

  const sortTypes = [
    'meta-score',
    'popularity',
    'healthiness',
    'price',
    'time',
    'random',
    'calories',
    'carbohydrates',
    'carbs',
  ]

  return (
    <div className="App">
      <header className="App-header">
        <div className="topDiv">
          <form onSubmit={handleSubmit} className="searchBox">
            <input type="text" value={searchValue} onChange={handleChange} placeholder="Search recipes" className="searchInput"></input>
          </form>
          <div className="dropdown">
            <div className="optionsDiv">
              <div className="searchOptions">
                <button className="dropbtn"><p>Sort: {sort}</p></button>
                <button className="sortDir" onClick={() => {
                  if(sortDirection === "asc"){
                    setSortDirection("desc");
                  }else{
                    setSortDirection("asc");
                  }
                  handleSort();
                }} >{sortDirection === "asc" ? <p>&#9650;</p> : <p>&#9660;</p>}</button>
              </div>
            </div>
            <div className="dropdown-content">
                {sortTypes.map(item => (
                  <button onClick={() => {
                    setSort(item);
                    handleSort();
                  }} className="dropdown-item" key={item}>{item}</button>
                ))}
              </div>
          </div>
        </div>
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
            isLoad ? <div className="recipeDiv">
              <p className="recipeTitle">{recipe.title}</p>
              <img src={recipe.image} alt={recipe.tite} className="recipeImg"></img>
              <p>Ready in <b>{recipe.readyInMinutes}</b> minutes | Makes <b>{recipe.servings}</b> servings | Recipe from <a href={recipe.sourceUrl}>{recipe.sourceName}</a></p>
              <ul>
                {recipe.extendedIngredients.map((item, index) => (
                  <li key={index}>
                      {item.original}
                  </li>
                ))}
              </ul>
              <ol>
                {recipe.analyzedInstructions[0].steps.map((item, index) => (
                  <li key={index}>
                      {item.step}
                  </li>
                ))}
              </ol>
            </div> : <div>Loading...</div>
          :
            <div></div>
        }
      </header>
    </div>
  );
}

export default App;

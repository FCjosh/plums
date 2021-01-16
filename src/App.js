import React, {useState} from 'react';
import initReactFastclick from 'react-fastclick';
import './App.css';

initReactFastclick();

const searchSelection = {
  'Sort Direction': 'asc',
  'Sort': 'meta-score',
  'Intolerance': [],
  'Cuisine': [],
  'Diet': [],
  'Meal Types': [],
}

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [showing, setShowing] = useState('home');
  const [isLoad, setIsLoad] = useState(false);
  const [recipe, setRecipe] = useState({});
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showFilterOption, setShowFilterOption] = useState('none');
  const [searchSelectionState, setSearchSelectionState] = useState({
    'Sort Direction': 'asc',
    'Sort': 'meta-score',
    'Intolerance': [],
    'Cuisine': [],
    'Diet': [],
    'Meal Types': [],
  });

  const searchAPI = () => {
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${searchValue}&number=9&sort=${searchSelection.Sort}&sortDirection=${searchSelection['Sort Direction']}&cuisine=${searchSelection.Cuisine}&diet=${searchSelection.Diet}&intolerances=${searchSelection.Intolerance}&type=${searchSelection.['Meal Types']}&apiKey=cacaef5c287c4b159cf6aeb1dc609470`)
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
  const handleSearchOptions = () => {
    if(showing === "search"){
      searchAPI();
    }
  }
  const searchData = {
    'Sort': [
      'meta-score', 'popularity', 'healthiness', 'price', 'time', 'random', 'calories', 'carbohydrates', 'carbs',
    ],
    'Filter': {
      'Intolerance': [
        'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
      ],
      'Cuisine': [
        'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese',
        'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean',
        'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese',
      ],
      'Diet': [
        'Gluten Free',
        'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30',
      ],
      'Meal Types': [
        'main course', 'side dish', 'dessert', 'appetizer',
        'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink',
      ],
    },
  }

  return (
    <div className="App">
      <div className="flexApp">
        <header className="App-header">
          <div className="topDiv">
            <form onSubmit={handleSubmit} className="searchBox">
              {showing === 'recipe' ?
                <button className="backButton" onClick={() => {
                  setShowing('search');
                }}><p>&#8592;</p></button>
              : <div></div>
              }
              <input value={searchValue} onChange={handleChange} placeholder="Search recipes" className="searchInput" type="search"></input>
              {showing === 'recipe' ?
                <div className="invRight"></div>
              : <div></div>
              }
            </form>
            <div className="dropdown">
              <div className="optionsDiv">
                <div className="searchOptions">
                  <button className={ showSort ? "dropbtnd" : "dropbtn"} onClick={() => {
                    if(showSort){
                      setShowSort(false);
                    } else {
                      setShowSort(true);
                    }
                    if(showFilter){
                      setShowFilter(false);
                    }
                    if(showFilterOption !== 'none'){
                      setShowFilterOption('none');
                    }
                  }}><p>Sort: {searchSelectionState.Sort}</p></button>
                  <button className="sortDir" onClick={() => {
                    if(searchSelection['Sort Direction'] === 'asc'){
                      searchSelection['Sort Direction'] = 'desc'
                    }else{
                      searchSelection['Sort Direction'] = 'asc'
                    }
                    setSearchSelectionState(JSON.parse(JSON.stringify(searchSelection)));
                    handleSearchOptions();
                  }} >{searchSelection['Sort Direction'] === "asc" ? <p>&#9650;</p> : <p>&#9660;</p>}</button>
                  <button className={ showFilter ? "dropbtnd" : "dropbtn"} onClick={() => {
                    if(showFilter){
                      setShowFilter(false);
                      handleSearchOptions();
                    } else {
                      setShowFilter(true);
                    }
                    if(showFilterOption !== 'none'){
                      setShowFilterOption('none');
                    }
                    if(showSort){
                      setShowSort(false);
                    }
                  }}><p>Filter</p></button>
                </div>
              </div>
              { showSort ?
                <div className="dropdown-content">
                  {searchData['Sort'].map(item => (
                    <button onClick={() => {
                      searchSelection.Sort = item;
                      setSearchSelectionState(JSON.parse(JSON.stringify(searchSelection)));
                      handleSearchOptions();
                      setShowSort(false);
                    }} className="dropdown-item" key={item} style={{ backgroundColor: searchSelectionState.Sort !== item ?'#BB86FC' : '#3700B3' }}>{item}</button>
                  ))}
                </div>
                : <div></div>
              }
              { showFilter ?
                <div className="dropdown-content">
                  {Object.keys(searchData.Filter).map(key => (
                    <button className={"dropbtn"} onClick={() => {
                      if(showFilterOption !== key){
                        setShowFilterOption(key);
                      } else {
                        setShowFilterOption('none');
                      }
                    }} key={key} style={{ backgroundColor: showFilterOption !== key ?'#BB86FC' : '#3700B3' }}><p>{key}: {searchSelectionState[key].length < 4 ? searchSelectionState[key].join(', ') : searchSelectionState[key][0] + ' ...'}</p></button>
                  ))}
                </div>
                : <div></div>
              }
              { showFilterOption !== 'none' ?
                <div className="dropdown-filter-content">
                  {searchData.Filter[showFilterOption].map(key => (
                    <button onClick={() => {
                      if(searchSelection[showFilterOption].includes(key)){
                        const index = searchSelection[showFilterOption].indexOf(key);
                        searchSelection[showFilterOption].splice(index, 1);
                      } else {
                        searchSelection[showFilterOption].push(key);
                      }
                      setSearchSelectionState(JSON.parse(JSON.stringify(searchSelection)));
                    }} className="dropdown-item" key={key} style={{ backgroundColor: !searchSelection[showFilterOption].includes(key) ?'#BB86FC' : '#3700B3' }}>{key}</button>
                  ))}
                </div>
                : <div></div>
              }
            </div>
          </div>
        </header>
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
      </div>
    </div>
  );
}

export default App;

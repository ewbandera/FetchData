const Pagination = ({ items, pageSize, onPageChange }) => {
    // Part 2 code goes here
    if(items<=1) return null;
    const { Button } = ReactBootstrap;
    let numPages = Math.ceil(items.length/pageSize);
    let pages = range(1, numPages);
    const list = pages.map(page => {
      return (
       
        <Button key={page} onClick={onPageChange} className="page-item">
          {page}
        </Button>
      );
    });
    return (
      <nav>
        <ul className="pagination">{list}</ul>
      </nav>
    );
  };
  
  const range = (start, end) => {
    return Array(end - start + 1)
      .fill(0)
      .map((item, i) => start + i);
  };
  
  function paginate(items, pageNumber, pageSize) {
    const start = (pageNumber - 1) * pageSize;
    let page = items.slice(start, start + pageSize);
    return page;
  }
  
  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
    
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
  
    useEffect(() => {
      let didCancel = false;
      const fetchData = async () => {
        // Part 1, step 1 code goes here
        dispatch({ type: "FETCH_INIT" });
        try {
          
          const result = await axios(url);
          if (!didCancel) {
            console.log(result);
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case 'FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };
  
  // App that gets data from Hacker News url
  function App() {
    const { Fragment, useState,useEffect } = React;
    const [howManyAnimals, setHowManyAnimals] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize,setPageSize] = useState(10);
    const [{ data, isLoading}, doFetch] = useDataApi(
      'https://zoo-animal-api.herokuapp.com/animals/rand/10',
        []
    );
    const handlePageChange = (e) => {
      setCurrentPage(Number(e.target.textContent));
    };
    const { Input } = ReactBootstrap;
    let page = data;
    if (page.length >= 1) {
      page = paginate(page, currentPage, pageSize);
      console.log(`currentPage: ${currentPage}`);
    }
    useEffect(()=>
    {
      doFetch(`https://zoo-animal-api.herokuapp.com/animals/rand/${howManyAnimals}`);
    },[howManyAnimals],[pageSize]);

    return (
      <Fragment>
         
          <label htmlFor="howMany">How Many Random Animals</label><br></br>
          <input
            id="howMany"
            type="number"
            max="10"
            value={howManyAnimals}
            onChange={event =>  setHowManyAnimals(Number(event.target.value))            
            } />
       <br></br>
       <label htmlFor="pSize"> Page Size</label><br></br>
          <input type="number" id="pSize" value={pageSize} max="10" onChange={e=>setPageSize(Number(e.target.value))} />
        
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          // Part 1, step 2 code goes here
          <><Pagination
          items={data}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          ></Pagination>
          <div className="imageGrid">
         
            {page.map((item) => (
              <div className="imageContainer">
              <img key={item.id} src={item.image_link} alt="image goes here" />
              <p><span style={{fontWeight:'bold'}}>{item.name}</span> <br></br>
              Latin Name: <span style={{ fontStyle:'italic'}}>{item.latin_name}</span>  <br></br>
              Lifespan: {item.lifespan}  <br></br>
              Habitat: {item.habitat}  <br></br>
              Diet: {item.diet}  <br></br>
              Geography: {item.geo_range}
              </p>
              </div>
            ))}
          </div>
          </>
        )}
        
      </Fragment>
    );
  }
  
  // ========================================
  ReactDOM.render(<App />, document.getElementById('root'));
  
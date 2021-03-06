import { useReducer } from "react";
import Head from 'next/head'
import Image from 'next/image'
import Ripples from 'react-ripples'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import gitHubPic from '../public/GitHub.png'
import AdBanner from "../component/AdBanner";

const initialState = {
  food: null,
  loading: false,
  err: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'FIND_FOOD_CLICKED':
      return { ...state, loading: true, error: ''};
    case 'FOOD_FETCHED':
      return { ...state, food: action.food, loading: false };
    case 'FOOD_FETCH_ERROR':
      return { ...state, loading: false };
    case 'RETURN_MENU':
      return { ...state, loading: true};
    case 'NO_GEO_LOCALISATION': 
      return { ...state, error: action.error}
    
  }
}

export async function getServerSideProps(context) {
  return {
    props: {
      clientId: process.env.GOOGLE_AD_SENSE_CLIENT,
      slot: process.env.GOOGLE_AD_SENSE_SLOT,
    },
  }
}


export default function Home({clientId, slot}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const findFood = async (position) => {
    let response =  await fetch(position && !position.code ? '/api?'+ new URLSearchParams({long: position.coords.longitude, lat: position.coords.latitude}) : '/api');
    try {
      if (response.ok) {
        const result = await response.json();
        dispatch({type: 'FOOD_FETCHED', food: result.foodType });
      } else {
         toast.error('Error while finding the food. Please retry!', { theme: "colored" });
        dispatch({type: 'FOOD_FETCH_ERROR'});
      }
    } catch (e) {
      toast.error('Error while finding the food. Please retry!', { theme: "colored" });
      dispatch({type: 'FOOD_FETCH_ERROR'});
    }
  }


  const askLocation = async () => {
    dispatch({type: 'FIND_FOOD_CLICKED'});
    if ('geolocation' in navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(findFood, () => {
        dispatch({type: 'NO_GEO_LOCALISATION', error: 'Can\'t show recommendation. Please be sure to be in secure connection using https.'});
        findFood();
      });
    } else {
      dispatch({type: 'NO_GEO_LOCALISATION', error: 'Can\'t show recommendations because your browser doesn\'t support Geolocation. (Facebook browser)'});
      findFood();

    }

  }

  return (
    <div className="container">
      <div className={`loading ${state.loading ? '' : 'hide'}`}>
        <div className="loading-text"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
      </div>
      <Head>
        <title>Whatoeat?</title>
        <meta name="title" content="What to eat?" />
        <meta name="description" content="What to eat? is an application that makes the hard decision for us and decide where to eat for the user. It also gives suggestion of restaurants you could go eating." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
        <meta name="google" content="notranslate" key="notranslate" />
        <meta name="twitter:card" content="summary"></meta>
        <meta name="twitter:site" content="@whatoeat"></meta>
        <meta name="twitter:creator" content="Whassa"></meta>
        <meta name="twitter:image" content="" />
        <meta property="og:title" content="What to eat?"/>
        <meta property="og:description" content="What to eat? is an application that makes the hard decision for us and decide where to eat for the user. It also gives suggestion of restaurants you could go eating." />
        <meta property="og:image" content="/static/images/logo.png" />
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630"/>
        <meta property="og:url" content="https://whatoeat.ca" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="all" />
      </Head>
    
      <main className="main">
        <div className="content"> 
          <h1 className="title">
            What to eat ? 
          </h1>
          
          { state.food ? 
            (
              <>
                <h2 className="food-title"> 
                  {state.food.name}
                </h2>
                { state.food.urls && state.food.urls.length > 0 && (<div className="food-url-text">Here is some place you could go :</div>)}
                { state.food.urls && state.food.urls.map( (restaurant) => (
                  <div key={restaurant.name} className="food-url">
                    <a href={restaurant.url} target="_blank" rel="noopener noreferrer"> {restaurant.name}</a> 
                  </div>
                    
                  ))
                }
                 { state.error && (
                  <div className="food-error">
                    {state.error}
                  </div> 
                  )
                }


                <p className={`description ${state.food && state.food.urls ? 'mt-5' : ''}`}>
                  Not satisfied ? You can retry by clicking the button below.
                </p>
              </>
            )
          :
          (
          <p className="description">
            Ask no more we resolve that issue for you by clicking on the button below.
          </p>
          )}


          <div className="buttons">
            <Ripples>
              <button className="button ripple" onClick={askLocation}>
                Find me what food to eat!!!
              </button>
            </Ripples>
          </div>
        </div>
        <div>
           
        </div>
      </main>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
      <footer className="footer">
        <a
          href="https://github.com/whassa"
          target="_blank"
          rel="noopener noreferrer"
        >
         <span className="footer-text">
           Made by whassa
         </span>
         <Image src={gitHubPic} alt="Git Hub Logo"/>
        </a>
      </footer>
    </div>
  )
}

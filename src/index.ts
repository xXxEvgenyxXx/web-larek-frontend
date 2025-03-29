import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekAPI';
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState} from "./state/AppState";

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
  
  api.getCards()
    .then((res) => {
      console.log(res);
    });
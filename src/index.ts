import './scss/styles.scss';

import { Api } from './components/base/api';
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState} from "./state/AppState";

const events = new EventEmitter();
const api = new Api(CDN_URL, API_URL);
import { WebLarekApi } from "../components/WebLarekAPI";
import { EventBroker } from "../components/base/events";
import { DataRepository } from "./DataRepository";
import {API_URL, CDN_URL} from "../utils/constants";

export class ServiceManager {
  private static instance: ServiceManager;
  public api: WebLarekApi;
  public eventBroker: EventBroker;
  public dataRepo: DataRepository;

  private constructor() {
    this.api = new WebLarekApi(CDN_URL, API_URL);
    this.eventBroker = new EventBroker();
    this.dataRepo = DataRepository.getInstance(this.api);
  }

  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }
}
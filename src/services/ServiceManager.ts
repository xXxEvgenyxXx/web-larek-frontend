import { Api } from "../components/base/api";
import { EventBroker } from "../components/base/events";
import { DataRepository } from "./DataRepository";

export class ServiceManager {
  private static instance: ServiceManager;
  public api: Api;
  public eventBroker: EventBroker;
  public dataRepo: DataRepository;

  private constructor() {
    this.api = new Api();
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
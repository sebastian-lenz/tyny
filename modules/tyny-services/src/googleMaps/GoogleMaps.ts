/**
 * Loader callback definition.
 */
export type GoogleMapsLoaderCallback = { (): void };

/**
 * Defines the possible load states.
 */
export const enum GoogleMapsState {
  Idle,
  Loading,
  Loaded,
}

/**
 * A service class that loads the GoogleMaps API.
 */
export default class GoogleMaps {
  /**
   * The API key that should be used.
   */
  apiKey: string | undefined;

  /**
   * Deferred object for creating load promises.
   */
  private promise: Promise<typeof google.maps> | null = null;

  /**
   * Current state of the API loader.
   */
  private state: GoogleMapsState = GoogleMapsState.Idle;

  /**
   * Return the current load state of the loader.
   *
   * @returns
   *   The current load state of the loader.
   */
  getState(): GoogleMapsState {
    return this.state;
  }

  /**
   * Load the google maps api.
   */
  load(): Promise<typeof google.maps> {
    let { promise } = this;
    if (!promise) {
      promise = new Promise(resolve => {
        (<any>window)['onTynyGoogleMapsReady'] = () => {
          this.state = GoogleMapsState.Loaded;
          resolve(google.maps);
        };
      });

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        this.apiKey
      }&callback=onTynyGoogleMapsReady`;
      document.head.appendChild(script);

      this.promise = promise;
      this.state = GoogleMapsState.Loading;
    }

    return promise;
  }
}

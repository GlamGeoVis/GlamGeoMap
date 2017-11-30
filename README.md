![TravisCIBadge](https://travis-ci.org/GlamGeoVis/GlamGeoMap.svg?branch=master)

# Glam Frontend
This is the frontend for GLAM. You can find the backend at [GlamGeoVis/GlamGeoServer](https://github.com/GlamGeoVis/GlamGeoServer).

## Requirements
* NPM `@>=3`, Node

## Dev setup
* Clone this repository
* `yarn install`
* `npm run build:dll`
* `npm run start`
* Server will run @ [http://localhost:3000](http://localhost:3000)
* Code will be hot-reloaded, eg. changes should reflect in the browser immediately.
* In development mode, the frontend expects to have a [backend](https://github.com/GlamGeoVis/GlamGeoServer) running at `http://localhost:8000/`.

## Test
* `npm run test`

## Production build
* `npm build`
* In production, the frontend will connect to the backend at `/risse` or `/trove`. Default backend is `/risse`, change to trove by appending `?trove` to the url.

## Structure
`internals` and `server` contain some React Boilerplate stuff, most notably Webpack settings etc.

`app` - application code

`components` - React components

`containers` - Interfaces React Components and Redux store, has `connectors`, `action consts` & `action creators`, `reducers`, `sagas`.

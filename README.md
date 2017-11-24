![TravisCIBadge](https://travis-ci.org/GlamGeoVis/GlamGeoMap.svg?branch=master)

Web based GLAMVis implementation.

This project was bootstrapped using [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate).

## Requirements
* NPM `@>=3`, yarn, Node

## Dev setup
* Clone this repository
* `yarn install`
* `npm run build:dll`
* `npm run start`
* Server will run @ [http://localhost:3000](http://localhost:3000)
* Code will be hot-reloaded, eg. changes should reflect in the browser immediately.

## Test
* `npm run test`

## Production build
* `npm build`

## Structure
`internals` and `server` contain some React Boilerplate stuff, most notably Webpack settings etc.

`app` - application code

`components` - React components

`containers` - Interfaces React Components and Redux store, has `connectors`, `action consts` & `action creators`, `reducers`, `sagas`.
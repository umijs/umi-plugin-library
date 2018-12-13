declare module 'webpack-merge';
declare module 'react';
declare module 'react-breakpoints'
declare module 'react-feather'
declare module 'react-helmet'
declare module 'react-powerplug'
declare module 'react-images'
declare module 'react-stickynode'
declare module 'react-github-button'
declare module 'webfontloader'

declare module 'facepaint' {
  interface Styles {
    [key: string]: string | number | Styles
  }

  interface MqStyles {
    [key: string]: string | string[] | number | number[] | Styles
  }

  type Mq = (styles: object) => Styles

  interface FacepaintSettings {
    literal?: boolean
    overlap?: boolean
  }

  type Facepaint = (
    /** media queries to be applied across */
    mediaQueries: string[],
    settings?: FacepaintSettings
  ) => Mq

  const facepaint: Facepaint

  export = facepaint
}

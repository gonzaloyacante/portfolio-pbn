export interface Colors {
  background: {
    light: string;
    dark: string;
  };
  foreground: {
    light: string;
    dark: string;
  };
  primary: string;
}

export default interface Settings {
  colors: Colors;
  title: string;
}

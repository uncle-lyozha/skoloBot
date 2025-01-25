export type ScriptType = {
  greetings: {
    hi: string;
    first: string;
    secondary: string;
  };
  commands: {
    addfact: string;
    addjoke: string;
    fact: string;
    joke: string;
  };
  addFactWiz: {
    onEnter: string;
    onEnd: string;
  };
  addJokeWiz: {
    onEnter: string;
    onEnd: string;
  };
};

export type GameScriptJSONType = {
  [key: string]: {
    replies: {
      type: string;
      message?: string;
      src?: string;
    }[];
    sense?: string;
    buttons: {
      text: string;
      nextStep: string;
    }[];
  };
};

export type GameJSONType = {
  story: {
    [key: string]: {
      replies: {
        type: string;
        message?: string;
        src?: string;
      }[];
      sense?: string;
      buttons: {
        text: string;
        nextStep: string;
      }[];
    };
  };
  battle: {
    [key: string]: {
      options: {
        [key: string]: number[];
      };
      feature: {
        [key: string]: number;
      };
    };
  };
};

export type GamesMenuJSONType = {
  [key: string]: {
    text: string;
    buttons: {
      text: string;
      game: string;
    }[];
  };
};

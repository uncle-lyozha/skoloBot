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

// export type GameJSONType = StoryJSONType & BattleJSONType;
export type GameJSONType = {
  story: StoryJSONType;
  battle: BattleJSONType;
};

export type StoryJSONType = {
  [key: string]: {
    reply: string;
    sense?: string;
    buttons: {
      text: string;
      nextStep: string;
    }[];
  };
};

export type BattleJSONType = {
  [key: string]: {
    reply: string;
    options?: {
      [key: string]: number[];
    };
    sense?: string;
    feature?: {
      [key: string]: number;
    };
    buttons: {
      text: string;
      nextStep: string;
    }[];
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

export type TStepOption = {
  [key: string]: number[];
};
